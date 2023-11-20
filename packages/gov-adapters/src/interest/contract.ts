import { BigNumber, Contract, ethers } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorBravoAbi from './abi-governor.json';
import tokenAbi from './abi-token.json';

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    id: BigNumber;
    description: string;
    proposer: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
  }
>;

export type ProposalCanceled = ParsedEvent<
  'ProposalCanceled',
  {
    id: BigNumber;
  }
>;

export type ProposalQueued = ParsedEvent<
  'ProposalQueued',
  {
    id: BigNumber;
    eta: BigNumber;
  }
>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    id: BigNumber;
  }
>;

export type VoteCast = ParsedEvent<
  'VoteCast',
  {
    voter: string;
    proposalId: BigNumber;
    /** 0 = AGAINST, 1 = FOR, 2 = ABSTAIN */
    support: number;
    votes: BigNumber;
    reason: string;
  }
>;

export type DelegateChanged = ParsedEvent<
  'DelegateChanged',
  {
    delegator: string;
    fromDelegate: string;
    toDelegate: string;
  }
>;

export type DelegateVotesChanged = ParsedEvent<
  'DelegateVotesChanged',
  {
    delegate: string;
    previousBalance: BigNumber;
    newBalance: BigNumber;
  }
>;

export type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;

export type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalCreated;

export type TransferEvents = ParsedEvent<
  'Transfer',
  {
    from: string;
    to: string;
    amount: BigNumber;
  }
>;

/**
 * Basic gov bravo interactions
 */
export class CompoundGovernorInterestContract {
  constructor(private readonly address: string, private readonly transports: TransportResolver) {}

  /**
   * Fetch all proposal-related events from the governance contract
   */
  async getProposalCreatedEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<ProposalCreated>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorBravoAbi, rpc);
    const response = await queryEventLogs<ProposalCreated>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCreated'],
      },
      startBlock,
      endBlock
    );
    return response;
  }

  /**
   * Get all (non-ProposalCreated) proposal events
   */
  async getProposalEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorBravoAbi, rpc);
    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCanceled', 'ProposalQueued', 'ProposalExecuted', 'ProposalCreated'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Get all delegation events
   */
  async getDelegationEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, tokenAbi, rpc);
    const response = await queryEventLogs<DelegateChangeEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['DelegateChanged', 'DelegateVotesChanged'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Get all votes cast for the entire contract
   */
  async getVoteEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<VoteCast>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorBravoAbi, rpc);
    const response = await queryEventLogs<VoteCast>(
      {
        rpc,
        cursor,
        contract,
        events: ['VoteCast'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Get all transfer events
   */
  async getTransferEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<TransferEvents>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, tokenAbi, rpc);
    const response = await queryEventLogs<TransferEvents>(
      {
        rpc,
        cursor,
        contract,
        events: ['Transfer'],
      },
      startBlock,
      endBlock
    );

    return response;
  }

  /**
   * Get quorum
   */
  async getQuorum(chainId: number): Promise<number> {
    const rpc = this.transports('rpc').network(chainId);

    const contract = new Contract(this.address, governorBravoAbi, rpc);
    const quorumResult = await contract.quorumVotes();
    const quorum = parseInt(ethers.utils.formatUnits(quorumResult, 18));

    return quorum;
  }
}
