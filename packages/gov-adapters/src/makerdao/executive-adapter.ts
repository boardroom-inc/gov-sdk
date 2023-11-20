import { BigNumber, Contract, ethers, FixedNumber } from 'ethers';
import {
  ProposalsAdapter,
  VoteAdapter,
  DelegationAdapter,
  TransportResolver,
  PaginationOptions,
  ProposalPage,
  VotePage,
  ExternalLink,
  ProposalEventPage,
  VotePowerAdapter,
  VotePowerInfo,
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  Proposal,
  Vote,
  DelegationEvent,
  TokenAddress,
  BalanceInfo,
  CastVoteData,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
} from '@boardroom/gov-lib';
import dsChiefAbi from './abi-dschief.json';
import voteDelegateAbi from './abi-vote-delegate.json';
import voteDelegateFactoryAbi from './abi-vote-delegate-factory.json';
import tokenAbi from './abi-token.json';
import { formatUnits, Interface } from 'ethers/lib/utils';
import { JsonRpcProvider } from 'gov-lib/node_modules/@ethersproject/providers/lib';
import { gql, GraphQLClient } from 'graphql-request';
import { getFunctionsSelectorsWithInputs, getFunctionsSignatures, getSelectorsFromFunctionsSignatures } from './../utils';

interface MakerDaoGovernorExecutiveAdapterConfig {
  chiefAddress: string;
  tokenAddress: string;
  voteDelegateFactoryAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for MakerDao Governor
 */
export class MakerDaoGovernorExecutiveAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter, DelegationAdapter {
  private readonly chiefAddress: string;
  private readonly tokenAddress: string;
  private readonly voteDelegateFactoryAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: MakerDaoGovernorExecutiveAdapterConfig) {
    this.chiefAddress = config.chiefAddress;
    this.tokenAddress = config.tokenAddress;
    this.voteDelegateFactoryAddress = config.voteDelegateFactoryAddress;
    this.transports = config.transports;
    this.protocolName = config.protocolName;
    this.chainId = config.chainId?? 1;
    this.boardroomAPIKey = config.boardroomAPIKey;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getSnapshotSpaceName(): Promise<string> {
    return '';
  }

  async getTokenAddress(): Promise<TokenAddress> {
    return this.tokenAddress;
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.chiefAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'makerDaoExecutive';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    return [];
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['vote'];
    return getFunctionsSelectorsWithInputs(dsChiefAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(voteDelegateAbi, ['lock']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return '';
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.tokenAddress;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.chiefAddress;
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const http = this.transports('http');

    let start = 0;
    let nextCursor = 0;
    if (pagination && pagination.cursor) {
      start = parseInt(pagination.cursor);
      nextCursor = Math.max(start - 5, 0);
    }

    const execVotes = await http.getJson('https://vote.makerdao.com/api/executive?limit=5&start=' + start);

    const proposals = [];
    let status = '';
    for (const p of execVotes.data) {
      if (p.spellData.hasBeenCast) {
        status = 'executed';
      }

      const details = await http.getJson('https://vote.makerdao.com/api/executive/' + p.key);

      const proposal = {
        id: details.data.key,
        title: details.data.title,
        proposer: details.data.address,
        choices: ['Support'],
        externalUrl: details.data.proposalLink,
        content: details.data.about,
        blockNumber: 0,
        startTime: { timestamp: Math.floor(new Date(details.data.date).getTime() / 1000) },
        endTime: { timestamp: Math.floor(new Date(details.data.spellData.expiration).getTime() / 1000) },
        status,
      } as Proposal;
      proposals.push(proposal);
    }

    return { items: proposals, nextCursor: nextCursor.toString() };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    /**
     * Since we are using the apis in getProposals there won't be any events.
     */
    return { items: [] };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const http = this.transports('http');
    const execVotesResp = await http.getJson(
      'https://staging-vote.vercel.app/api/executive/supporters?network=mainnet'
    );

    interface execVote {
      address: string;
      deposits: number;
      percent: string;
    }

    const proposals = await this.getProposals();
    const execVotes: Map<string, execVote[]> = new Map(Object.entries(execVotesResp.data));

    const items = [] as Vote[];
    for (const prop of proposals.items) {
      const votesToAdd = execVotes.get(prop.proposer.toLowerCase());
      if (votesToAdd) {
        for (const v of votesToAdd) {
          items.push({
            time: { timestamp: 0 },
            proposalId: prop.id,
            address: v.address,
            choice: 0, // choice is always zero since the only option is 'support'
            power: Number(v.deposits),
          });
        }
      }
    }

    return { items };
  }

  async getEncodedCastVoteData({ proposalId, reason, address }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    if (reason) {
      throw new Error('reason parameter is not supported');
    }

    const rpc = this.transports('rpc').network(await this.getChainId());
    const encoder = new ethers.utils.AbiCoder();
    const encodedParam = encoder.encode(['address'], [proposalId]);
    const slate = ethers.utils.keccak256('0x' + encodedParam.slice(-64)) as any;

    let encodedData,
      voteDelegateProxyAddress = '';
    const hasDelegateProxy = await this._hasDelegateProxy(rpc, address);
    if (hasDelegateProxy) {
      voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
      const contract = new Contract(voteDelegateProxyAddress, voteDelegateAbi, rpc);
      const functionSignature = contract.interface.getSighash('vote');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [slate]);
    } else {
      const contract = new Contract(this.chiefAddress, dsChiefAbi, rpc);
      const functionSignature = contract.interface.getSighash('vote');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [slate]);
    }

    return {
      encodedData,
      toContractAddress: hasDelegateProxy ? voteDelegateProxyAddress : this.chiefAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId } = params;
    let { identifier } = params;
    const rpc = this.transports('rpc').network(await this.getChainId());
    const signer = this.transports('signer').signer;

    // Encoding info:
    // https://github.com/makerdao/governance-portal-v2/blob/develop/modules/executive/components/VoteModal/DefaultView.tsx#L123-L126
    const encoder = new ethers.utils.AbiCoder();
    const encodedParam = encoder.encode(['address'], [proposalId]);
    const slate = ethers.utils.keccak256('0x' + encodedParam.slice(-64)) as any;

    const address = await signer.getAddress();

    let res;
    if (await this._hasDelegateProxy(rpc, address)) {
      const voteDelegateProxyAddress = await this._getDelegateProxyAddress(rpc, address);
      const contract = new Contract(voteDelegateProxyAddress, voteDelegateAbi, signer);
      res = await contract.vote(slate);
    } else {
      const contract = new Contract(this.chiefAddress, dsChiefAbi, signer);
      res = await contract.vote(slate);
    }

    try {
      identifier = identifier ?? 'default';
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'castVoteMakerDaoExecutive',
        hashId: res.hash,
        proposalId: proposalId,
        userAddress: await signer.getAddress(),
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

  async delegateVotingPower(delegatee: string, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;

    const tokenContract = new Contract(this.tokenAddress, tokenAbi, signer);

    //all the signer's tokens will be delegated
    const balance = await tokenContract.balanceOf(await signer.getAddress());
    const formattedAmount = BigNumber.from(balance).toString();

    // approve delegation
    await tokenContract.approve(delegatee);

    const contract = new Contract(delegatee, voteDelegateAbi, signer);
    const res = await contract.lock(formattedAmount, { gasLimit: 195000 });

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateMakerDao',
        hashId: res.hash,
        proposalId: '',
        userAddress: await signer.getAddress(),
        identifier,
        separateAction: 'delegate',
        separateFramework: await this.getFramework(),
      });
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async getDelegationEvents(pagination: PaginationOptions = {}): Promise<DelegationEventPage> {
    const allDelegatesQuery = gql`
      {
        allDelegates {
          nodes {
            delegate
            voteDelegate
            blockTimestamp
          }
        }
      }
    `;

    const allDelegatesData = {
      query: allDelegatesQuery.toString(),
      operationName: 'allDelegates',
    };

    const http = this.transports('http');
    const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', allDelegatesData);
    const allDelegatesResp = resp.data.data;

    const allDelegates = [];
    for (const node of allDelegatesResp.allDelegates.nodes) {
      allDelegates.push(node.voteDelegate);
    }

    const mkrLockedDelegateArrayTotalsQuery = gql`
      query mkrLockedDelegateArrayTotalsV2($argAddress: [String]!, $argUnixTimeStart: Int!, $argUnixTimeEnd: Int!) {
        mkrLockedDelegateArrayTotals(
          argAddress: $argAddress
          unixtimeStart: $argUnixTimeStart
          unixtimeEnd: $argUnixTimeEnd
        ) {
          nodes {
            fromAddress
            immediateCaller
            lockAmount
            blockNumber
            blockTimestamp
            lockTotal
            callerLockTotal
            hash
          }
        }
      }
    `;

    const delegateEventsData = [];
    const now = Math.floor(Date.now() / 1000);
    const numAddressesToQuery = 100;
    for (let i = 0; i < Math.ceil(allDelegates.length / numAddressesToQuery); i++) {
      const partialAddresses = allDelegates.slice(numAddressesToQuery * i, numAddressesToQuery * (i + 1));

      const mkrLockedDelegateArrayTotalsData = {
        query: mkrLockedDelegateArrayTotalsQuery.toString(),
        variables: {
          argAddress: partialAddresses,
          argUnixTimeStart: 0,
          argUnixTimeEnd: now,
        },
        operationName: 'mkrLockedDelegateArrayTotalsV2',
      };

      const delegateEventsResp = await http.postJson(
        'https://pollingdb2-mainnet-staging.makerdux.com/api/v1',
        mkrLockedDelegateArrayTotalsData
      );
      delegateEventsData.push(...delegateEventsResp.data.data.mkrLockedDelegateArrayTotalsV2.nodes);
    }

    const items = [] as DelegationEvent[];
    for (const event of delegateEventsData) {
      items.push({
        delegator: event.fromAddress,
        fromDelegate: '',
        toDelegate: event.immediateCaller,
        amount: event.lockAmount,
        aaveDelegationType: '',
        snapshotId: '',
        eventType: event.lockAmount > 0 ? 'DELEGATED' : 'UNDELEGATED',
        time: { blockNumber: event.blockNumber },
        txHash: event.hash,
      });
    }

    return { items };
  }

  async getDelegation(address: string): Promise<string> {
    // Since one address can delegate to multiple addresses this method signature doesn't work.
    throw new Error('getDelegation is not supported for the makerDao framework. Use getDelegations method instead.');
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const results = [] as DelegationsInfo[];
    for (const address of addresses) {
      const query = gql`
        query mkrDelegatedToV2($argAddress: String!) {
          mkrDelegatedTo(argAddress: $argAddress) {
            nodes {
              fromAddress
              immediateCaller
              lockAmount
              blockNumber
              blockTimestamp
              hash
            }
          }
        }
      `;

      const data = {
        query: query.toString(),
        variables: {
          argAddress: address,
        },
        operationName: 'mkrDelegatedToV2',
      };

      const http = this.transports('http');
      const resp = await http.postJson('https://pollingdb2-mainnet-staging.makerdux.com/api/v1', data);
      const mkrDelegatedTo = resp.data.data;

      for (const res of mkrDelegatedTo.mkrDelegatedToV2.nodes) {
        results.push({
          address,
          addressDelegatedTo: res.immediateCaller,
        });
      }
    }

    return results;
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());

    // If an address has a delegate address we want to get the vote power of the delegate address instead
    const addressListWithDelegateAddresses = [];
    for (const address of addresses) {
      if (await this._hasDelegateProxy(rpc, address)) {
        addressListWithDelegateAddresses.push(await this._getDelegateProxyAddress(rpc, address));
      } else {
        addressListWithDelegateAddresses.push(address);
      }
    }

    const chiefDeposits = await this._getChiefDeposits(
      rpc,
      this.chiefAddress,
      addressListWithDelegateAddresses,
      addresses,
      blockHeight
    );

    return chiefDeposits;
  }

  private async _getChiefDeposits(
    rpc: JsonRpcProvider,
    chiefAddress: string,
    addressListWithDelegateAddresses: string[],
    addresses: string[],
    blockHeight?: number
  ): Promise<VotePowerInfo[]> {
    const iface = new Interface(dsChiefAbi);
    const calls = addressListWithDelegateAddresses.map((a) => {
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
