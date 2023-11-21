import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    id: BigNumber;
    description: string;
    proposer: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
    signatures: string[];
    calldatas: string[];
    values: BigNumber[];
    targets: string[];
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
    support: boolean;
    votes: BigNumber;
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
 * Basic gov alpha interactions
 */
export declare class CompoundGovernorAlphaContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Fetch all proposal-related events from the governance contract
     */
    getProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    /**
     * Get all proposal events
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
}
