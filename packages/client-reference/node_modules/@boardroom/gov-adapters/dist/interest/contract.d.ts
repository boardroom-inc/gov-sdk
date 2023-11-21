import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    id: BigNumber;
    description: string;
    proposer: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
}>;
export declare type ProposalCanceled = ParsedEvent<'ProposalCanceled', {
    id: BigNumber;
}>;
export declare type ProposalQueued = ParsedEvent<'ProposalQueued', {
    id: BigNumber;
    eta: BigNumber;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    id: BigNumber;
}>;
export declare type VoteCast = ParsedEvent<'VoteCast', {
    voter: string;
    proposalId: BigNumber;
    /** 0 = AGAINST, 1 = FOR, 2 = ABSTAIN */
    support: number;
    votes: BigNumber;
    reason: string;
}>;
export declare type DelegateChanged = ParsedEvent<'DelegateChanged', {
    delegator: string;
    fromDelegate: string;
    toDelegate: string;
}>;
export declare type DelegateVotesChanged = ParsedEvent<'DelegateVotesChanged', {
    delegate: string;
    previousBalance: BigNumber;
    newBalance: BigNumber;
}>;
export declare type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;
export declare type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalCreated;
export declare type TransferEvents = ParsedEvent<'Transfer', {
    from: string;
    to: string;
    amount: BigNumber;
}>;
/**
 * Basic gov bravo interactions
 */
export declare class CompoundGovernorInterestContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Fetch all proposal-related events from the governance contract
     */
    getProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    /**
     * Get all (non-ProposalCreated) proposal events
     */
    getProposalEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
    /**
     * Get all votes cast for the entire contract
     */
    getVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<VoteCast>>>;
    /**
     * Get all transfer events
     */
    getTransferEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<TransferEvents>>>;
    /**
     * Get quorum
     */
    getQuorum(chainId: number): Promise<number>;
}
