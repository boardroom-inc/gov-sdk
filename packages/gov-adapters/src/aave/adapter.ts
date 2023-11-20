import { Contract, ethers } from 'ethers';
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
  DelegationAdapter,
  Framework,
  DelegationEventPage,
  DelegationsInfo,
  TokenAddress,
  BalanceInfo,
  GeneralAdapter,
  TransferEventPage,
  CastVoteData,
  Proposal,
  CastVoteEncodedResponse,
  CastVoteEncodedData,
  Vote,
} from '@boardroom/gov-lib';

import {
  AaveGovernanceV2Contract,
  DelegateChangeEvents,
  ProposalContent,
  TransferEvents,
} from './contract-v2';
import { mapDelegationEvents, mapProposalEvents, mapProposal, mapVotes } from './transforms';
import governanceAbi from './abi-v2.json';
import aaveTokenAbi from './abi-aave.json';
import strategyAbi from './abi-strategy.json';
import executorAbi from './abi-executor.json';
import { Provider, Contract as MultiContract } from 'ethers-multicall';
import { formatUnits } from 'ethers/lib/utils';
import { LogResult } from '../rpc';
import { getFunctionsSelectorsWithInputs, getFunctionsSignatures, getSelectorsFromFunctionsSignatures } from './../utils';

export interface AaveContracts {
  governance: string;
  token: string;
  strategy: string;
}

interface AaveGovernanceV2AdapterConfig {
  contracts: AaveContracts;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for Compound Alpha Governor
 */
export class AaveGovernanceV2Adapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, GeneralAdapter {
  private readonly contracts: AaveContracts;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: AaveGovernanceV2AdapterConfig) {
    this.contracts = config.contracts;
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

  async getTokenAddress(): Promise<TokenAddress> {
    return this.contracts.token;
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.contracts.governance}`,
    };
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['create']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['submitVote', 'submitVoteBySignature'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(aaveTokenAbi, ['delegate']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return this.contracts.governance;
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.contracts.token;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.contracts.governance;
  }

  async getFramework(): Promise<Framework> {
    return 'aave';
  }

  /**
   * Cannot paginate aave proposals
   */
  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.contracts.token, aaveTokenAbi, rpc);
    const totalSupply = parseInt(ethers.utils.formatUnits(await contract.totalSupply(), 18));

    const governor = new AaveGovernanceV2Contract(this.contracts.governance, this.transports);
    const results = await governor.getAllProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    // resolve the content from IPFS -- while the promises are created all at
    // once, actual request parallelism will be determined by the http transport
    // configuration so this is not as gnarly as it looks
    const content = new Map<string, ProposalContent>();
    await Promise.all(
      results.items.map(async (item: { parsed: { args: { ipfsHash: any } } }) => {
        const { ipfsHash } = item.parsed.args;
        const file = await governor.getProposalContent(ipfsHash);
        content.set(ipfsHash, file);
      })
    );

    // reduce the results
    const proposals = [] as Proposal[];
    for (const item of results.items) {
      const ipfsContent = content.get(item.parsed.args.ipfsHash);
      if (!ipfsContent) throw new Error('unresolved ipfs content');

      const contract = new Contract(item.parsed.args.executor, executorAbi, rpc);
      const minQuorumBps = parseInt(ethers.utils.formatUnits(await contract.MINIMUM_QUORUM(), 1));

      // The executor reports the percent of the total supply that is needed for quorum
      // It is reported in bps so we have to calculate the percent of the supply here
      const quorum = totalSupply * 0.001 * minQuorumBps;

      const proposal = mapProposal(item.parsed, ipfsContent, quorum, item.event.transactionHash);
      proposals.push(proposal);
    }

    return { items: proposals, nextCursor: results.nextCursor };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const governor = new AaveGovernanceV2Contract(this.contracts.governance, this.transports);
    const results = await governor.getAllProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const events = mapProposalEvents(results.items);

    return { items: events, nextCursor: results.nextCursor };
  }

  /**
   * We can paginate vote events but we cant filter by proposal
   */
  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new AaveGovernanceV2Contract(this.contracts.governance, this.transports);
    const results = await governor.getAllVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const votes = mapVotes(results.items);

    return { items: votes, nextCursor: results.nextCursor };
  }

  async getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    if (choice !== 0 && choice !== 1) {
      throw new Error('choice parameter must be 0 or 1');
    }

    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.contracts.governance;
    const contract = new Contract(this.contracts.governance, governanceAbi, rpc);
    const functionSignature = contract.interface.getSighash('submitVote');
    const encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.contracts.governance, governanceAbi, signer);

    if (choice !== 0 && choice !== 1) {
      throw new Error('choice parameter must be 0 or 1');
    }

    const res = await contract.submitVote(parseInt(proposalId, 10), choice !== 0);

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteAave',
          hashId: res.hash,
          proposalId: proposalId,
          userAddress: await signer.getAddress(),
          identifier,
          separateAction: 'castVote',
          separateFramework: await this.getFramework(),
        }),

        this.transports('http').postJson(`https://api.boardroom.info/v1/voters/addOrUpdatePendingVote?key=${this.boardroomAPIKey}`, {
          cname: this.protocolName,
          choices: choice,
          address: await signer.getAddress(),
          txnHash: res.hash,
          status: 'pending',
          power,
          proposalRefId,
          adapter: adapter || 'onchain',
        }),
      ]);
      await apiCalls;
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async delegateVotingPower(delegatee: string, identifier?: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.contracts.token, aaveTokenAbi, signer);
    const res = await contract.delegate(delegatee);

    try {
      const result = await this.transports('http').postJson(
        `https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`,
        {
          protocol: this.protocolName,
          action: 'delegateAave',
          hashId: res.hash,
          proposalId: '',
          userAddress: await signer.getAddress(),
          identifier,
          separateAction: 'delegate',
          separateFramework: await this.getFramework(),
        }
      );
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async getDelegationEvents(pagination: PaginationOptions = {}): Promise<DelegationEventPage> {
    const tokenContract = new AaveGovernanceV2Contract(this.contracts.token, this.transports);
    const tokenResults = await tokenContract.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const tokenEvents = tokenResults.items.map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i));

    return { items: tokenEvents, nextCursor: tokenResults.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.contracts.token, aaveTokenAbi, rpc);
    return await contract.getDelegateeByType(address, 0);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.contracts.token, aaveTokenAbi, rpc);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.getDelegateeByType(address, 0));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    const contract = new MultiContract(this.contracts.strategy, strategyAbi);

    let block = blockHeight;
    if (block === undefined) {
      block = await rpc.getBlockNumber();
    }

    const calls = addresses.map((a) => contract.getVotingPowerAt(a, block));
    const powers = await provider.all(calls);

    const info = powers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
    });

    return info;
  }

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.contracts.token, aaveTokenAbi, rpc);

    const calls = addresses.map((a) => contract.balanceOf(a));

    const balances = await Promise.all(calls);
    return balances.map<BalanceInfo>((balance, idx) => {
      return { address: addresses[idx], balance: parseFloat(formatUnits(balance, 18)) };
    });
  }

  async getTransferEvents(pagination: PaginationOptions = {}): Promise<TransferEventPage> {
    const governor = new AaveGovernanceV2Contract(this.contracts.token, this.transports);
    const results = await governor.getTransferEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((log: LogResult<TransferEvents>) => {
      return {
        from: log.parsed.args.from,
        to: log.parsed.args.to,
        value: formatUnits(log.parsed.args.value, 18),
        txHash: log.event.transactionHash,
      };
    });

    return { items: events, nextCursor: results.nextCursor };
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
