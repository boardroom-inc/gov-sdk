import { BigNumber, Contract, ethers } from 'ethers';
import {
  ProposalsAdapter,
  VoteAdapter,
  TransportResolver,
  PaginationOptions,
  ProposalPage,
  VotePage,
  ExternalLink,
  ProposalEventPage,
  VotePowerAdapter,
  VotePowerInfo,
  Framework,
  Proposal,
  WalletMapInfo,
  Vote,
  BalanceInfo,
  CastVoteData,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
} from '@boardroom/gov-lib';
import dsChiefAbi from './abi-dschief.json';
import pollingAbi from './abi-polling.json';
import tokenAbi from './abi-token.json';
import voteProxyAbi from './abi-vote-proxy.json';
import voteProxyFactoryAbi from './abi-vote-proxy-factory.json';
import voteDelegateFactoryAbi from './abi-vote-delegate-factory.json';
import voteDelegateAbi from './abi-vote-delegate.json';
import { formatUnits, Interface } from 'ethers/lib/utils';
import { gql, GraphQLClient } from 'graphql-request';
import { JsonRpcProvider } from 'gov-lib/node_modules/@ethersproject/providers/lib';
import { getFunctionsSelectorsWithInputs } from './../utils';

interface MakerDaoGovernorPollingAdapterConfig {
  chiefAddress: string;
  pollingAddress: string;
  tokenAddress: string;
  voteProxyFactoryAddress: string;
  voteDelegateFactoryAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for MakerDao Governor
 */
export class MakerDaoGovernorPollingAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter {
  private readonly chiefAddress: string;
  private readonly pollingAddress: string;
  private readonly tokenAddress: string;
  private readonly voteProxyFactoryAddress: string;
  private readonly voteDelegateFactoryAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: MakerDaoGovernorPollingAdapterConfig) {
    this.chiefAddress = config.chiefAddress;
    this.pollingAddress = config.pollingAddress;
    this.tokenAddress = config.tokenAddress;
    this.voteProxyFactoryAddress = config.voteProxyFactoryAddress;
    this.voteDelegateFactoryAddress = config.voteDelegateFactoryAddress;
    this.transports = config.transports;
    this.protocolName = config.protocolName;
    this.chainId = config.chainId ?? 1;
    this.boardroomAPIKey = config.boardroomAPIKey;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getSnapshotSpaceName(): Promise<string> {
    return '';
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.pollingAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'makerDaoPolling';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    return [];
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['vote'];
    return getFunctionsSelectorsWithInputs(pollingAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    return [];
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return '';
  }

  async getDelegationContractAddress(): Promise<string> {
    return '';
  }

  async getVotingContractAddress(): Promise<string> {
    return this.pollingAddress;
  }


  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const query = gql`
    query activePolls($first: Int, $before: Cursor, $last: Int, $after: Cursor, $offset: Int, $filter: ActivePollsRecordFilter) {
        edges {
          node {
            creator
            pollId
            blockCreated
            startDate
            endDate
            multiHash
            url
          }
          cursor
        }
    }
    `;

    let cursor = null;
    if (pagination.cursor) {
      cursor = pagination.cursor;
    }

    const data = {
      "query": query.toString(),
      "variables": {
        "first": 10,
        "after": cursor
      },
      "operationName": "activePolls"
    }

    const http = this.transports('http');
    const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', data);
    const proposalData = resp.data.data;

    const proposals = [];
    let nextCursor = null;
    for (const p of proposalData.activePolls.edges) {
      let proposalUrl = p.node.url;
      if (p.node.url.includes('github.com')) {
        proposalUrl = proposalUrl.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
      }
      if (p.node.url.includes('%3F')) {
        proposalUrl = proposalUrl.replace('%3F', '');
      }
      if (p.node.url.includes('%3A')) {
        proposalUrl = proposalUrl.replace('%3A', ' -');
      }
      if (p.node.url.includes('.md.md')) {
        proposalUrl = proposalUrl.replace('.md.md', '.md');
      }
      if (
        p.node.url.includes('Reduce%20the%20Box%20Parameter%20-%20%20September%2014%2C%202020.md') ||
        p.node.url.includes(
          'Increase%20the%20Dust%20Parameter%20for%20ETH-B%20Vault%20Type%20-%20March%2015%2C%202021.md'
        )
      ) {
        continue;
      }
      const pollData = await http.fetch(proposalUrl);

      const pollText = await pollData.text();
      const [start, pollInfo, ...content] = pollText.split('---');

      if (!pollInfo) {
        console.log(proposalUrl);
        throw new Error('pollText was malformed');
      }

      const title = pollInfo.match(/title:.*/);
      if (!title) {
        console.log(pollText);
        throw new Error('Could not extract title from poll text');
      } else {
        if (title[0].startsWith("title: ")){
          title[0] = title[0].substring(7);
        }
      }

      const optionSnippet = pollInfo.match(/options:((.|\n)*)/);
      if (!optionSnippet) {
        console.log(pollText);
        throw new Error('Could not extract options from poll text');
      }

      const optionArray = [...optionSnippet[1].matchAll(/\d: (.*)/g)];
      if (!optionArray) {
        console.log(pollText);
        throw new Error('Could not extract options from option snippet');
      }
      const choices = optionArray.map((o) => o[1]);

      let type = 'single-choice';
      const scores = [];
      try {
        const propData = await http.getJson('https://vote.makerdao.com/api/polling/tally/' + p.node.pollId.toString());
        if (propData.response.status === 200) {
          if (propData.data.parameters.inputFormat.type === 'rank-free') {
            type = 'ranked-choice';
          }

          for (const vote of propData.data.votesByAddress) {
            scores.push({
              choice: vote.ballot[0].toString(),
              total: parseFloat(vote.mkrSupport).toFixed(4),
            });
          }
        }
      } catch (err) {
        console.log(err);
      }

      const proposal = {
        id: p.node.pollId.toString(),
        title: title[0],
        proposer: p.node.creator,
        externalUrl: proposalUrl,
        content: content.join(),
        choices: choices,
        blockNumber: p.node.blockCreated,
        type: type,
        scores: scores,
        startTime: { timestamp: p.node.startDate },
        endTime: { timestamp: p.node.endDate },
      } as Proposal;
      proposals.push(proposal);
      nextCursor = p.cursor;
    }
    if (nextCursor === null) {
      nextCursor = cursor;
    }
    return { items: proposals, nextCursor: nextCursor };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    /**
     * Since we are using the apis in getProposals there won't be any events.
     */

    return { items: [] };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    // To periodically get votes proposalIds in the pagination options should be used.
    // https://vote.makerdao.com/api/polling/tally/800 where 800 is the pollId

    const http = this.transports('http');

    const items = [] as Vote[];
    if (pagination.proposalIds) {
      for (const pollId of pagination.proposalIds) {
        const voteResponse = await http.getJson('https://vote.makerdao.com/api/polling/tally/' + pollId);
        if (voteResponse.response.status === 200) {
          const votes = voteResponse.data.votesByAddress;
          for (const vote of votes) {
            items.push({
              address: vote.voter,
              choice: vote.ballot,
              power: parseFloat(parseFloat(vote.mkrSupport).toFixed(4)),
              time: { timestamp: 0 },
              proposalId: pollId.toString(),
            });
          }
        }
      }
    }

    return { items };
  }

  async getEncodedCastVoteData({ proposalId, choice, address }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    let encodedData,
      voteDelegateProxyAddress = '';
    const hasDelegateProxy = await this._hasDelegateProxy(rpc, address);
    if (hasDelegateProxy) {
      voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
      const contract = new Contract(voteDelegateProxyAddress, voteDelegateAbi, rpc);
      const functionSignature = contract.interface.getSighash('votePoll');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
    } else {
      const contract = new Contract(this.pollingAddress, pollingAbi, rpc);
      const functionSignature = contract.interface.getSighash('vote');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
    }

    return {
      encodedData,
      toContractAddress: hasDelegateProxy ? voteDelegateProxyAddress : this.pollingAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice } = params;
    let { identifier } = params;
    const signer = this.transports('signer').signer;
    const rpc = this.transports('rpc').network(await this.getChainId());

    const address = await signer.getAddress();

    let res;
    if (await this._hasDelegateProxy(rpc, address)) {
      const voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
      const contract = new Contract(voteDelegateProxyAddress, voteDelegateAbi, signer);
      res = await contract.votePoll(proposalId, choice);
    } else {
      const contract = new Contract(this.pollingAddress, pollingAbi, signer);
      res = await contract.vote(proposalId, choice);
    }

    try {
      identifier = identifier ?? 'default';
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'castVoteMakerDaoPolling',
        hashId: res.hash,
        proposalId: proposalId,
        userAddress: address,
        identifier,
        separateAction: 'castVote',
        separateFramework: await this.getFramework(),
      });
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  private async _hasDelegateProxy(rpc: JsonRpcProvider, address: string): Promise<boolean> {
    const iface = new Interface(voteDelegateFactoryAbi);

    const callData = iface.encodeFunctionData('isDelegate', [address]);

    const result = await rpc.call({
      to: this.voteDelegateFactoryAddress,
      data: callData,
    });

    // If the decoded result is a 1 that means it does have a delegate proxy
    return ethers.utils.hexValue(BigNumber.from(result).toHexString()) === '0x1';
  }

  private async _getDelegateProxyAddress(rpc: JsonRpcProvider, address: string): Promise<string> {
    const iface = new Interface(voteDelegateFactoryAbi);

    const callData = iface.encodeFunctionData('delegates', [address]);

    const result = await rpc.call({
      to: this.voteDelegateFactoryAddress,
      data: callData,
    });
    const delegateProxyAddress = '0x' + result.substring(result.length - 40);

    return delegateProxyAddress;
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    /**
     * https://dux.makerdao.network/how-to-calculate-polling-results
     * The voting power associated with each vote is based on the total MKR balance of the voter at the block that the poll ends on. 
     * Below are the calculations for total MKR balance:

     * If the voter has an active vote proxy(*), sum up the following balances:
     * MKR tokens stored in the hot wallet
     * MKR tokens stored in the cold wallet (unless cold wallet is the same as hot wallet)
     * MKR tokens deposited into chiefs (1.1 and 1.2) by their active vote proxy
     * MKR tokens deposited into chiefs (1.1 and 1.2) by their hot wallet
     * MKR tokens deposited into chiefs (1.1 and 1.2) by their cold wallet (unless cold wallet is the same as hot wallet)
     * MKR in the vote proxy contract (this should be 0, since any MKR sent directly to a vote proxy is unrecoverable)

     * If the voter does not have an active vote proxy, sum up the following balances:
     * MKR tokens stored in the address
     * MKR tokens deposited into chiefs (1.1 and 1.2) by the address
     */
    const rpc = this.transports('rpc').network(await this.getChainId());

    // If an address has a delegate address we want to get the vote power of the delegate address instead
    const addressListWithDelegateAddresses = [];
    const addressDelegateMap = new Map();
    for(const address of addresses) {
      if (await this._hasDelegateProxy(rpc, address)) {
        addressListWithDelegateAddresses.push(await this._getDelegateProxyAddress(rpc, address));
        addressDelegateMap.set(await this._getDelegateProxyAddress(rpc, address), address);
      } else {
        addressListWithDelegateAddresses.push(address);
        addressDelegateMap.set(address, address);
      }
    }

    const tokensInWallet = await this._getBalanceOf(
      rpc,
      this.tokenAddress,
      addressListWithDelegateAddresses,
      blockHeight
    );
    const chiefDeposits = await this._getChiefDeposits(
      rpc,
      this.chiefAddress,
      addressListWithDelegateAddresses,
      blockHeight
    );

    const resultsOfProxyCheck = await this._hasProxy(rpc, addressListWithDelegateAddresses);

    const addressesWithProxy = resultsOfProxyCheck.filter((a) => a.power === 1).map((a) => a.address);
    const addressesWithoutProxy = resultsOfProxyCheck.filter((a) => a.power === 0).map((a) => a.address);

    const info: VotePowerInfo[] = [];

    if (addressesWithoutProxy.length > 0) {
      for (const address of addressesWithoutProxy) {
        const tokens = tokensInWallet.filter((a) => a.address === address);
        const chiefDeposit = chiefDeposits.filter((a) => a.address === address);
        const power = tokens[0].power + chiefDeposit[0].power;
        info.push({ protocol: this.protocolName, address: addressDelegateMap.get(address), power });
      }
    }

    if (addressesWithProxy.length > 0) {
      const coldProxyContracts = await this._getWalletMap(rpc, addressesWithProxy, 'coldMap');
      const hotProxyContracts = await this._getWalletMap(rpc, addressesWithProxy, 'hotMap');

      for (const address of addressesWithProxy) {
        const coldProxyContract = coldProxyContracts.filter((a) => a.address === address);
        const hotProxyContract = hotProxyContracts.filter((a) => a.address === address);
        let coldWallet;
        let hotWallet;
        if (coldProxyContract.length === 1 && coldProxyContract[0].wallet !== '0x0') {
          coldWallet = await this._getWalletFromVoteProxy(rpc, coldProxyContract[0].wallet, 'cold');
          hotWallet = await this._getWalletFromVoteProxy(rpc, coldProxyContract[0].wallet, 'hot');
        }
        if (hotProxyContract.length === 1 && hotProxyContract[0].address !== '0x0' && coldProxyContract.length === 1) {
          coldWallet = await this._getWalletFromVoteProxy(rpc, hotProxyContract[0].wallet, 'cold');
          hotWallet = await this._getWalletFromVoteProxy(rpc, hotProxyContract[0].wallet, 'hot');
        }

        if (coldWallet && hotWallet) {
          // use hot/cold/proxy addresses to query dsChief for tokens now
          const addressesToQuery = [hotProxyContract[0].wallet, hotWallet[0].wallet];
          if (coldProxyContract[0].address !== hotProxyContract[0].address) {
            addressesToQuery.push(coldProxyContract[0].wallet);
            addressesToQuery.push(coldWallet[0].wallet);
          }
          const proxyChiefDeposits = await this._getChiefDeposits(
            rpc,
            this.chiefAddress,
            addressesToQuery,
            blockHeight
          );
          let power = 0;
          const tokens = tokensInWallet.filter((a) => a.address === address);
          const chiefDeposit = chiefDeposits.filter((a) => a.address === address);

          // Sum all the relevant powers
          power += tokens[0].power;
          if (coldWallet[0].wallet !== chiefDeposit[0].address) {
            power += chiefDeposit[0].power;
          }
          for (const deposit of proxyChiefDeposits) {
            power += deposit.power;
          }

          info.push({ protocol: this.protocolName, address: addressDelegateMap.get(address), power });
        }
      }
    }

    return info;
  }

  private async _hasProxy(rpc: JsonRpcProvider, addresses: string[]): Promise<VotePowerInfo[]> {
    const iface = new Interface(voteProxyFactoryAbi);
    const calls = addresses.map((a) => {
      const callData = iface.encodeFunctionData('hasProxy', [a]);

      return rpc.call({
        to: this.voteProxyFactoryAddress,
        data: callData,
      });
    });
    const callResults = await Promise.all(calls);
    const parsedResults = callResults.map<VotePowerInfo>((value, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseInt(value) };
    });

    return parsedResults;
  }

  private async _getWalletFromVoteProxy(
    rpc: JsonRpcProvider,
    address: string,
    functionName: string
  ): Promise<WalletMapInfo[]> {
    const iface = new Interface(voteProxyAbi);
    const callData = iface.encodeFunctionData(functionName);

    const call = rpc.call({
      to: address,
      data: callData,
    });
    const callResults = await Promise.all([call]);
    const parsedResults = callResults.map<WalletMapInfo>((value, idx) => {
      if (value === '0x') {
        return { address, wallet: value };
      }
      value = '0x' + value.substring(value.length - 40);
      return { address, wallet: BigNumber.from(value).toHexString() }; //ethers.utils.hexValue(BigNumber.from(value).toHexString())
    });

    return parsedResults;
  }

  private async _getWalletMap(
    rpc: JsonRpcProvider,
    addresses: string[],
    functionName: string
  ): Promise<WalletMapInfo[]> {
    const iface = new Interface(voteProxyFactoryAbi);
    const calls = addresses.map((a) => {
      const callData = iface.encodeFunctionData(functionName, [a]);

      return rpc.call({
        to: this.voteProxyFactoryAddress,
        data: callData,
      });
    });
    const callResults = await Promise.all(calls);
    const parsedResults = callResults.map<WalletMapInfo>((value, idx) => {
      return { address: addresses[idx], wallet: ethers.utils.hexValue(BigNumber.from(value).toHexString()) };
    });

    return parsedResults;
  }

  private async _getChiefDeposits(
    rpc: JsonRpcProvider,
    chiefAddress: string,
    addresses: string[],
    blockHeight?: number
  ): Promise<VotePowerInfo[]> {
    const iface = new Interface(dsChiefAbi);
    addresses = addresses.filter((a) => a != '0x0');
    const calls = addresses.map((a) => {
      const callData = iface.encodeFunctionData('deposits', [a]);

      if (blockHeight === undefined) {
        return rpc.call({
          to: chiefAddress,
          data: callData,
        });
      } else {
        return rpc.call(
          {
            to: chiefAddress,
            data: callData,
          },
          blockHeight
        );
      }
    });
    const powers = await Promise.all(calls);
    const info = powers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
    });

    return info;
  }

  private async _getBalanceOf(
    rpc: JsonRpcProvider,
    tokenAddress: string,
    addresses: string[],
    blockHeight?: number
  ): Promise<VotePowerInfo[]> {
    const iface = new Interface(tokenAbi);
    const calls = addresses.map((a) => {
      const callData = iface.encodeFunctionData('balanceOf', [a]);

      if (blockHeight === undefined) {
        return rpc.call({
          to: tokenAddress,
          data: callData,
        });
      } else {
        return rpc.call(
          {
            to: tokenAddress,
            data: callData,
          },
          blockHeight
        );
      }
    });
    const powers = await Promise.all(calls);
    const info = powers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
    });

    return info;
  }

  async getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]> {
    return [];
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string) : Promise<Proposal> {
    throw new Error("Function not defined for this adapter");
  }

  async getProposalIdFromEvent() : Promise<string> {
    throw new Error("Function not defined for this adapter");
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error("Function not defined for this adapter");
  }
}
