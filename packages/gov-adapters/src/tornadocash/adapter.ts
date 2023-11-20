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
  CastVoteData,
  CastVoteEncodedData,
  CastVoteEncodedResponse,
  Proposal,
  Vote,
} from '@boardroom/gov-lib';
import { DelegateChangeEvents, ProposalCreated, TornadoCashGovernanceContract } from './contract';
import { mapDelegationEvents, mapProposalEvents, mapProposal, mapVotes } from './transforms';
import governanceAbi from './abi-governor.json';
import { Provider, Contract as MultiContract } from 'ethers-multicall';
import { formatUnits, Interface } from 'ethers/lib/utils';
import { LogResult } from '../rpc';
import { getFunctionsSelectorsWithInputs, getFunctionsSignatures, getSelectorsFromFunctionsSignatures } from './../utils';
import { Log } from 'gov-lib/node_modules/@ethersproject/providers/lib';

interface TornadoCashGovernorAdapterConfig {
  governanceAddress: string;
  tokenAddress: string;
  transports: TransportResolver;
  protocolName: string;
  chainId?: number;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for Tornado Cash Governor
 */
export class TornadoCashGovernorAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter {
  private readonly governanceAddress: string;
  private readonly tokenAddress: string;
  private readonly transports: TransportResolver;
  private readonly protocolName: string;
  private readonly chainId?: number;
  private readonly boardroomAPIKey?: string;

  constructor(config: TornadoCashGovernorAdapterConfig) {
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

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.governanceAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'tornadoCash';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['propose', 'proposeByDelegate']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['castVote', 'castDelegatedVote'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['delegate', 'undelegate']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getProposalCreationContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getDelegationContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getVotingContractAddress(): Promise<string> {
    return this.governanceAddress;
  }

  async getProposals(pagination: PaginationOptions = {}): Promise<ProposalPage> {
    const governor = new TornadoCashGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getAllProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const proposals = results.items.map((item: { parsed: ProposalCreated; event: Log }) =>
      mapProposal(item.parsed, ['AGAINST', 'FOR'], item.event.blockNumber, item.event.transactionHash)
    );

    return { items: proposals, nextCursor: results.nextCursor };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const proposals = await this.getProposals(pagination);

    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    const multiContract = new MultiContract(this.governanceAddress, governanceAbi);

    const calls = proposals.items.map((p: { id: any }) => multiContract.state(p.id));
    const results = await provider.all(calls);
    const events = mapProposalEvents(results, proposals);

    return { items: events };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new TornadoCashGovernanceContract(this.governanceAddress, this.transports);
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
    const governanceAddress = this.governanceAddress;
    const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
    const functionSignature = contract.interface.getSighash('castVote');
    const encodedData = contract.interface.encodeFunctionData(functionSignature, [
      parseInt(proposalId, 10),
      choice !== 0,
    ]);
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, adapter, identifier } = params;
    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);

    if (choice !== 0 && choice !== 1) {
      throw new Error('choice parameter must be 0 or 1');
    }

    const res = await contract.castVote(parseInt(proposalId, 10), choice !== 0);

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteTornadoCash',
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
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);
    const res = await contract.delegate(delegatee);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateTornadoCash',
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
    const governor = new TornadoCashGovernanceContract(this.governanceAddress, this.transports);
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
    const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
    return await contract.delegatedTo(address);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.delegatedTo(address));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const provider = new Provider(rpc, await this.getChainId());
    const multiContract = new MultiContract(this.governanceAddress, governanceAbi);

    let info: VotePowerInfo[];

    if (blockHeight === undefined) {
      const calls = addresses.map((a) => multiContract.lockedBalance(a));
      const powers = await provider.all(calls);
      info = powers.map<VotePowerInfo>((power, idx) => {
        return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
      });
    } else {
      const iface = new Interface(governanceAbi);
      const calls = addresses.map((a) => {
        const callData = iface.encodeFunctionData('lockedBalance', [a]);

        return rpc.call(
          {
            to: this.governanceAddress,
            data: callData,
          },
          blockHeight
        );
      });
      const powers = await Promise.all(calls);
      info = powers.map<VotePowerInfo>((power, idx) => {
        return { protocol: this.protocolName, address: addresses[idx], power: parseFloat(formatUnits(power, 18)) };
      });
    }

    return info;
  }

  async getBalance(addresses: string[]): Promise<BalanceInfo[]> {
    return [];
  }

  async getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    return [];
  }

  async getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal> {
    throw new Error('Function not defined for this adapter');
  }

  async getProposalIdFromEvent(): Promise<string> {
    throw new Error('Function not defined for this adapter');
  }

  async getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote> {
    throw new Error('Function not defined for this adapter');
  }
}
