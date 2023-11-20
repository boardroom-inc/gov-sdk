import { Contract, ethers } from 'ethers';
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
  TokenAddress,
  BalanceInfo,
  GeneralAdapter,
  TransferEventPage,
  CastVoteData,
  Proposal,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
  Vote,
} from '@boardroom/gov-lib';
import {
  DelegateChangeEvents,
  TransferEvents,
  NounsBuilderGovernorContract,
  AnyProposalEvent,
} from './contract';
import { mapProposalEvent, mapProposal, mapVotes, mapDelegationEvents } from './transforms';
import governanceAbi from './abi-governor.json';
import nounsTokenAbi from './abi-token.json';
import { Provider, Contract as MultiContract } from 'ethers-multicall';
import { LogResult } from '../rpc';
import { getFunctionsSignatures, getSelectorsFromFunctionsSignatures, getFunctionsSelectorsWithInputs } from './../utils';

interface NounsBuilderAdapterConfig {
  governanceAddress: string;
  tokenAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for Nouns Builder Governor
 */
export class NounsBuilderAdapter
  implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, GeneralAdapter {
  private readonly governanceAddress: string;
  private readonly tokenAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: NounsBuilderAdapterConfig) {
    this.governanceAddress = config.governanceAddress;
    this.tokenAddress = config.tokenAddress;
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
    return this.tokenAddress;
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['propose']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['castVote', 'castVoteWithReason', 'castVoteBySig'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(nounsTokenAbi, ['delegate', 'delegateBySig']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.tokenAddress;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.governanceAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'nounsBuilder';
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const governor = new NounsBuilderGovernorContract(this.governanceAddress, this.transports);
    const results = await governor.getProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const rpc = this.transports('rpc').network(await this.getChainId());

    const items = [] as Proposal[];
    for (const item of results.items) {
      const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
      const quorumResult = await contract.quorum();
      const quorum = parseInt(ethers.utils.formatUnits(quorumResult, 0));
      const proposal = mapProposal(
        item.parsed,
        ['AGAINST', 'FOR', 'ABSTAIN'],
        item.event.blockNumber,
        quorum,
        item.event.transactionHash
      );
      items.push(proposal);
    }

    return { items, nextCursor: results.nextCursor };
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalIdFromEvent(): Promise<string> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const governor = new NounsBuilderGovernorContract(this.governanceAddress, this.transports);
    const results = await governor.getProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const events = results.items.map((i: LogResult<AnyProposalEvent>) => mapProposalEvent(i));
    return { items: events, nextCursor: results.nextCursor };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new NounsBuilderGovernorContract(this.governanceAddress, this.transports);
    const results = await governor.getVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const votes = mapVotes(results.items);

    return { items: votes, nextCursor: results.nextCursor };
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error('Function not defined for this adapter');
  }

  async getEncodedCastVoteData({ proposalId, choice, reason }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.governanceAddress;
    const contract = new Contract(governanceAddress, governanceAbi, rpc);
    let encodedData;
    if (reason) {
      const functionSignature = contract.interface.getSighash('castVoteWithReason');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice, reason]);
    } else {
      const functionSignature = contract.interface.getSighash('castVote');
      encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
    }
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, identifier, adapter, reason } = params;

    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    let res;
    if (reason) {
      res = await contract.castVoteWithReason(proposalId, choice, reason);
    } else {
      res = await contract.castVote(proposalId, choice);
    }

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteNounsBuilder',
          hashId: res.hash,
          proposalId: proposalId,
          userAddress: await signer.getAddress(),
          identifier,
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

  async delegateVotingPower(delegatee: string): Promise<string> {
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.tokenAddress, nounsTokenAbi, signer);
    const res = await contract.delegate(delegatee);

    try {
      const result = await this.transports('http').postJson(
        `https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`,
        {
          protocol: this.protocolName,
          action: 'delegateNounsBuilder',
          hashId: res.hash,
          proposalId: '',
          userAddress: await signer.getAddress(),
        }
      );
    } catch (err) {
      console.log(err);
    }

    return res.hash;
  }

  async getDelegationEvents(pagination: PaginationOptions = {}): Promise<DelegationEventPage> {
    const governor = new NounsBuilderGovernorContract(this.tokenAddress, this.transports);
    const results = await governor.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((i: LogResult<DelegateChangeEvents>) => mapDelegationEvents(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, nounsTokenAbi, rpc);
    return await contract.delegates(address);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, nounsTokenAbi, rpc);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.delegates(address));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    const contract = new MultiContract(this.tokenAddress, nounsTokenAbi);
    // any[] is the type that comes back from the ethers contract
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let calls: any[];

    if (blockHeight === undefined) {
      calls = addresses.map((address) => contract.getVotes(address));
    } else {
      const { timestamp } = await rpc.getBlock(blockHeight);
      calls = addresses.map((address) => contract.getPastVotes(address, timestamp));
    }

    const powers = await provider.all(calls);
    const info = powers.map<VotePowerInfo>((power, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseInt(power) };
    });

    return info;
  }

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.tokenAddress, nounsTokenAbi, rpc);

    const calls = addresses.map((a) => contract.balanceOf(a));

    const balances = await Promise.all(calls);
    return balances.map<BalanceInfo>((balance, idx) => {
      return { address: addresses[idx], balance: parseInt(balance) };
    });
  }

  async getTransferEvents(pagination: PaginationOptions = {}): Promise<TransferEventPage> {
    const governor = new NounsBuilderGovernorContract(this.tokenAddress, this.transports);
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
        value: '1',
        txHash: log.event.transactionHash,
      };
    });

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }
}
