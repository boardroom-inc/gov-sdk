import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    id: BigNumber;
    proposer: string;
    target: string;
    startTime: BigNumber;
    endTime: BigNumber;
    description: string;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    proposalId: BigNumber;
}>;
export declare type Voted = ParsedEvent<'Voted', {
    voter: string;
    proposalId: BigNumber;
    support: boolean;
    votes: BigNumber;
}>;
export declare type Delegated = ParsedEvent<'Delegated', {
    account: string;
    to: string;
}>;
export declare type Undelegated = ParsedEvent<'Undelegated', {
    account: string;
    from: string;
}>;
export declare type DelegateChangeEvents = Delegated | Undelegated;
export declare type NonCreatedProposalEvent = ProposalExecuted;
export declare class TornadoCashGovernanceContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Fetch all proposal created events from the governance contract
     */
    getAllProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    /**
     * Fetch all vote events from governance contract
     */
    getAllVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<Voted>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
}
