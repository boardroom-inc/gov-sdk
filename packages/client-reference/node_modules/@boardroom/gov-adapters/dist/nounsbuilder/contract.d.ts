import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    proposalId: string;
    description: string;
    proposal: [string, number, number, number, number, number, number, number, number, boolean, boolean, boolean];
    calldatas: string[];
    targets: string[];
    values: BigNumber[];
    signatures: string[];
}>;
export declare type ProposalCanceled = ParsedEvent<'ProposalCanceled', {
    proposalId: string;
}>;
export declare type ProposalQueued = ParsedEvent<'ProposalQueued', {
    proposalId: string;
    eta: BigNumber;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    proposalId: string;
}>;
export declare type ProposalVetoed = ParsedEvent<'ProposalVetoed', {
    proposalId: string;
}>;
export declare type VoteCast = ParsedEvent<'VoteCast', {
    voter: string;
    proposalId: BigNumber;
    /** 0 = AGAINST, 1 = FOR, 2 = ABSTAIN */
    support: number;
    weight: BigNumber;
    reason: string;
}>;
export declare type DelegateChanged = ParsedEvent<'DelegateChanged', {
    delegator: string;
    from: string;
    to: string;
}>;
export declare type DelegateVotesChanged = ParsedEvent<'DelegateVotesChanged', {
    delegate: string;
    prevTotalVotes: BigNumber;
    newTotalVotes: BigNumber;
}>;
export declare type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;
export declare type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalVetoed | ProposalCreated;
export declare type TransferEvents = ParsedEvent<'Transfer', {
    from: string;
    to: string;
    tokenId: BigNumber;
}>;
/**
 * Basic gov interactions
 */
export declare class NounsBuilderGovernorContract {
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
     * Get all votes cast for the entire contract
     */
    getVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<VoteCast>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
    /**
     * Get all transfer events
     */
    getTransferEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<TransferEvents>>>;
}
