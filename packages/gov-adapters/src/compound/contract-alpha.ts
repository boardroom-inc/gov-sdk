import { BigNumber, Contract } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent, queryEventLogs } from '../rpc';
import governorAlphaAbi from './abi-alpha.json';
import tokenAbi from './abi-comp.json';

/*

  Data source module for Compound Governor Alpha on-chain governance modules

  https://compound.finance/docs/governance

  https://github.com/compound-finance/compound-protocol/blob/master/contracts/Governance/GovernorAlpha.sol

*/

export type ProposalCreated = ParsedEvent<
  'ProposalCreated',
  {
    id: BigNumber;
    description: string;
    proposer: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
    signatures: string[];
    calldatas: string[];
    values: BigNumber[];
    targets: string[];
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
    support: boolean;
    votes: BigNumber;
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
 * Basic gov alpha interactions
 */
export class CompoundGovernorAlphaContract {
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
    const contract = new Contract(this.address, governorAlphaAbi, rpc);
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
    const contract = new Contract(this.address, governorAlphaAbi, rpc);
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
    const contract = new Contract(this.address, governorAlphaAbi, rpc);
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
}
