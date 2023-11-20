import { BigNumber, Contract, ContractInterface } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorAbi from './abi-governor.json';
import tokenAbi from './abi-token.json';

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    proposalId: string;
    description: string;
    proposal: [string, number, number, number, number, number, number, number, number, boolean, boolean, boolean];
    calldatas: string[];
    targets: string[];
    values: BigNumber[];
    signatures: string[];
  }
>;

export type ProposalCanceled = ParsedEvent<
  'ProposalCanceled',
  {
    proposalId: string;
  }
>;

export type ProposalQueued = ParsedEvent<
  'ProposalQueued',
  {
    proposalId: string;
    eta: BigNumber;
  }
>;

export type ProposalExecuted = ParsedEvent<
  'ProposalExecuted',
  {
    proposalId: string;
  }
>;

export type ProposalVetoed = ParsedEvent<
  'ProposalVetoed',
  {
    proposalId: string;
  }
>;

export type VoteCast = ParsedEvent<
  'VoteCast',
  {
    voter: string;
    proposalId: BigNumber;
    /** 0 = AGAINST, 1 = FOR, 2 = ABSTAIN */
    support: number;
    weight: BigNumber;
    reason: string;
  }
>;

export type DelegateChanged = ParsedEvent<
  'DelegateChanged',
  {
    delegator: string;
    from: string;
    to: string;
  }
>;

export type DelegateVotesChanged = ParsedEvent<
  'DelegateVotesChanged',
  {
    delegate: string;
    prevTotalVotes: BigNumber;
    newTotalVotes: BigNumber;
  }
>;

export type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;

export type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalVetoed | ProposalCreated;

export type TransferEvents = ParsedEvent<
  'Transfer',
  {
    from: string;
    to: string;
    tokenId: BigNumber;
  }
>;

/**
 * Basic gov interactions
 */
export class NounsBuilderGovernorContract {
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
    const contract = new Contract(this.address, governorAbi as ContractInterface, rpc);
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
   * Get all proposal events
   */
  async getProposalEvents(
    chainId: number,
    cursor?: string,
    startBlock?: number,
    endBlock?: number
  ): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>> {
    const rpc = this.transports('rpc').network(chainId);
    const contract = new Contract(this.address, governorAbi as ContractInterface, rpc);
    const response = await queryEventLogs<AnyProposalEvent>(
      {
        rpc,
        cursor,
        contract,
        events: ['ProposalCanceled', 'ProposalQueued', 'ProposalExecuted', 'ProposalVetoed', 'ProposalCreated'],
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
    const contract = new Contract(this.address, governorAbi as ContractInterface, rpc);
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
}
