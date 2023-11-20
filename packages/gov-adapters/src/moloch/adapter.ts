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
import governanceAbi from './abi-governor.json';
import { Interface } from 'ethers/lib/utils';
import { MolochGovernanceContract, AnyProposalEvent } from './contract';
import { mapProposalEvents, mapProposal, mapVotes, mapDelegationEvents } from './transforms';
import { LogResult } from '../rpc';
import { getFunctionsSelectorsWithInputs, getFunctionsSignatures, getSelectorsFromFunctionsSignatures } from './../utils';

interface MolochGovernorAdapterConfig {
  governanceAddress: string;
  transports: TransportResolver;
  chainId?: number;
  protocolName: string;
  boardroomAPIKey?: string;
}

/**
 * Proposals adapter for Moloch Governor
 */
export class MolochGovernorAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter, DelegationAdapter {
  private readonly governanceAddress: string;
  private readonly transports: TransportResolver;
  private readonly chainId?: number;
  private readonly protocolName: string;
  private readonly boardroomAPIKey?: string;

  constructor(config: MolochGovernorAdapterConfig) {
    this.governanceAddress = config.governanceAddress;
    this.transports = config.transports;
    this.chainId = config.chainId ?? 1;
    this.protocolName = config.protocolName;
    this.boardroomAPIKey = config.boardroomAPIKey;
  }

  async getChainId(): Promise<number> {
    return this.chainId ? this.chainId : 1;
  }

  async getSnapshotSpaceName(): Promise<string> {
    return '';
  }

  async getTokenAddress(): Promise<TokenAddress> {
    throw new Error('No token address for Moloch protocols');
  }

  async getExternalLink(): Promise<ExternalLink> {
    return {
      name: 'Etherscan.io',
      url: `https://etherscan.io/address/${this.governanceAddress}`,
    };
  }

  async getFramework(): Promise<Framework> {
    return 'moloch';
  }

  async getProposalCreationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['submitProposal']);
    return getSelectorsFromFunctionsSignatures(functionsSignatures);
  }

  async getVotingFunctionsSelectors(): Promise<Record<string, string[]>> {
    const functionNames = ['submitVote'];
    return getFunctionsSelectorsWithInputs(governanceAbi, functionNames);
  }

  async getDelegationFunctionsSelectors(): Promise<string[]> {
    const functionsSignatures = getFunctionsSignatures(governanceAbi, ['updateDelegateKey']);
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
    const governor = new MolochGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getAllProposalCreatedEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const rpc = this.transports('rpc').network(await this.getChainId());
    const iface = new Interface(governanceAbi);

    // Get the summoning time (time at which contract was deployed in unixtime seconds)
    const summoningTimeCallData = iface.encodeFunctionData('summoningTime');
    const summoningTimeCall = rpc.call({
      to: this.governanceAddress,
      data: summoningTimeCallData,
    });
    const summoningTimeResult = await Promise.all([summoningTimeCall]);
    const summoningTime = parseInt(summoningTimeResult[0], 16);

    // Get the period duration (length of 1 period in seconds)
    const periodDurationCallData = iface.encodeFunctionData('periodDuration');
    const periodDurationCall = rpc.call({
      to: this.governanceAddress,
      data: periodDurationCallData,
    });
    const periodDurationResult = await Promise.all([periodDurationCall]);
    const periodDuration = parseInt(periodDurationResult[0], 16);

    // Get the voting period length (number of periods a vote lasts)
    const votingPeriodLengthCallData = iface.encodeFunctionData('votingPeriodLength');
    const votingPeriodLengthCall = rpc.call({
      to: this.governanceAddress,
      data: votingPeriodLengthCallData,
    });
    const votingPeriodLengthResult = await Promise.all([votingPeriodLengthCall]);
    const votingPeriodLength = parseInt(votingPeriodLengthResult[0], 16);

    // Populate the starting periods for each proposal
    const startingPeriodMap = new Map();
    for (const item of results.items) {
      const proposalsCallData = iface.encodeFunctionData('proposals', [item.parsed.args.proposalId]);
      const proposalsCall = rpc.call({
        to: this.governanceAddress,
        data: proposalsCallData,
      });
      const proposalsResult = await Promise.all([proposalsCall]);
      startingPeriodMap.set(item.parsed.args.proposalId.toString(), proposalsResult[0]);
    }

    const proposals = results.items.map((item) =>
      mapProposal(
        item.parsed,
        ['YES', 'NO'],
        item.event.blockNumber,
        summoningTime,
        periodDuration,
        votingPeriodLength,
        iface
          .decodeFunctionResult('proposals', startingPeriodMap.get(item.parsed.args.proposalId.toString()))
          ['startingPeriod'].toString(),
        item.event.transactionHash
      )
    );

    return { items: proposals, nextCursor: results.nextCursor };
  }

  async getProposalEvents(pagination: PaginationOptions = {}): Promise<ProposalEventPage> {
    const governor = new MolochGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getProposalEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );
    const events = results.items.map((i: LogResult<AnyProposalEvent>) => mapProposalEvents(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getVotes(pagination: PaginationOptions = {}): Promise<VotePage> {
    const governor = new MolochGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getAllVoteEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const rpc = this.transports('rpc').network(await this.getChainId());
    const iface = new Interface(governanceAbi);
    const calls = results.items.map(
      (item: { event: { blockNumber: any }; parsed: { args: { memberAddress: any } } }) => {
        const blockHeight = item.event.blockNumber;
        const callData = iface.encodeFunctionData('members', [item.parsed.args.memberAddress]);

        return rpc.call(
          {
            to: this.governanceAddress,
            data: callData,
          },
          blockHeight
        );
      }
    );
    const powers = await Promise.all(calls);
    const powerMap = powers.map((a) => parseInt(iface.decodeFunctionResult('members', a)['shares'], 10));

    const votes = mapVotes(results.items, powerMap);

    return { items: votes, nextCursor: results.nextCursor };
  }

  async getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const governanceAddress = this.governanceAddress;
    const contract = new Contract(governanceAddress, governanceAbi, rpc);
    const functionSignature = contract.interface.getSighash('submitVote');
    const encodedData = contract.interface.encodeFunctionData(functionSignature, [parseInt(proposalId), choice]);
    return {
      encodedData,
      toContractAddress: governanceAddress,
    };
  }

  async castVote(params: CastVoteData): Promise<string> {
    const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;

    const signer = this.transports('signer').signer;
    const contract = new Contract(this.governanceAddress, governanceAbi, signer);
    const res = await contract.submitVote(parseInt(proposalId), choice);

    try {
      const apiCalls = Promise.all([
        this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
          protocol: this.protocolName,
          action: 'castVoteMoloch',
          hashId: res.hash,
          proposalId,
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
          adapter: adapter || 'onchain',
          proposalRefId,
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
    const res = await contract.updateDelegateKey(delegatee);

    try {
      await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
        protocol: this.protocolName,
        action: 'delegateMoloch',
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
    const governor = new MolochGovernanceContract(this.governanceAddress, this.transports);
    const results = await governor.getDelegationEvents(
      await this.getChainId(),
      pagination.cursor,
      pagination.startBlock,
      pagination.endBlock
    );

    const events = results.items.map((i) => mapDelegationEvents(i));

    return { items: events, nextCursor: results.nextCursor };
  }

  async getDelegation(address: string): Promise<string> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
    return await contract.memberAddressByDelegateKey(address);
  }

  async getDelegations(addresses: string[]): Promise<DelegationsInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());
    const contract = new Contract(this.governanceAddress, governanceAbi, rpc);
    const calls = [];
    for (const address of addresses) {
      calls.push(contract.memberAddressByDelegateKey(address));
    }
    const delegations = await Promise.all(calls);
    return delegations.map<DelegationsInfo>((addressDelegatedTo, idx) => {
      return { address: addresses[idx], addressDelegatedTo };
    });
  }

  async getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]> {
    const rpc = this.transports('rpc').network(await this.getChainId());

    if (blockHeight === undefined) {
      blockHeight = await rpc.getBlockNumber();
    }

    const iface = new Interface(governanceAbi);
    const calls = addresses.map((a) => {
      const callData = iface.encodeFunctionData('members', [a]);

      return rpc.call(
        {
          to: this.governanceAddress,
          data: callData,
        },
        blockHeight
      );
    });
    const powers = await Promise.all(calls);
    const info = powers.map((a, idx) => {
      return { protocol: this.protocolName, address: addresses[idx], power: parseInt(iface.decodeFunctionResult('members', a)['shares'], 10) };
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
