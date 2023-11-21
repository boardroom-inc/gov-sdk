import { BigNumber, Bytes } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    proposalId: BigNumber;
    proposer: string;
    targets: string[];
    values: BigNumber[];
    signatures: string[];
    calldatas: string[];
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
}>;
export declare type ProposalCreatedWithVotingModule = ParsedEvent<'ProposalCreated', {
    proposalId: BigNumber;
    proposer: string;
    votingModule: string;
    proposalData: string;
    startBlock: BigNumber;
    endBlock: BigNumber;
    description: string;
}>;
export declare type ProposalQueued = ParsedEvent<'ProposalQueued', {
    proposalId: BigNumber;
    eta: BigNumber;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    proposalId: BigNumber;
}>;
export declare type ProposalCanceled = ParsedEvent<'ProposalCanceled', {
    proposalId: BigNumber;
}>;
export declare type VoteCast = ParsedEvent<'VoteCast', {
    voter: string;
    proposalId: BigNumber;
    support: number;
    weight: BigNumber;
    reason: string;
}>;
export declare type VoteCastWithParams = ParsedEvent<'VoteCastWithParams', {
    voter: string;
    proposalId: BigNumber;
    support: number;
    weight: BigNumber;
    reason: string;
    params: Bytes;
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
export declare type VoteCastEvents = VoteCast | VoteCastWithParams;
export declare type DelegateChangeEvents = DelegateChanged | DelegateVotesChanged;
export declare type ProposalCreatedEvents = ProposalCreated | ProposalCreatedWithVotingModule;
export declare type AnyProposalEvent = ProposalCanceled | ProposalExecuted | ProposalCreated | ProposalQueued | ProposalCreatedWithVotingModule;
export declare type TransferEvents = ParsedEvent<'Transfer', {
    from: string;
    to: string;
    value: BigNumber;
}>;
export declare class OpenZeppelinGovernanceContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Fetch all proposal created events from the governance contract
     */
    getAllProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    /**
     * Fetch all proposal created events from the governance contract
     */
    getAllProposalCreatedWithVotingModuleEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreatedWithVotingModule>>>;
    getProposalEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    getProposalEventsWithVotingModule(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    /**
     * Fetch all vote events from governance contract
     */
    getAllVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<VoteCastEvents>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
    /**
     * Get all transfer events
     */
    getTransferEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number, isTokenERC721?: boolean): Promise<PaginatedResponse<LogResult<TransferEvents>>>;
    getProposalDeadline(chainId: number, proposalId: string): Promise<number>;
}
