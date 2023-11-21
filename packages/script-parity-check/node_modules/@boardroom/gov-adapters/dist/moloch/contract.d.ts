import { BigNumber } from 'ethers';
import { TransportResolver, PaginatedResponse } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type SubmitProposal = ParsedEvent<'SubmitProposal', {
    applicant: string;
    sharesRequested: BigNumber;
    lootRequested: BigNumber;
    tributeOffered: BigNumber;
    tributeToken: BigNumber;
    paymentRequested: BigNumber;
    paymentToken: string;
    details: string;
    flags: boolean[];
    proposalId: BigNumber;
    delegateKey: string;
    memberAddress: string;
}>;
export declare type SponsorProposal = ParsedEvent<'SponsorProposal', {
    delegateKey: string;
    memberAddress: string;
    proposalId: BigNumber;
    proposalIndex: BigNumber;
    startingPeriod: BigNumber;
}>;
export declare type ProcessProposal = ParsedEvent<'ProcessProposal', {
    proposalIndex: BigNumber;
    proposalId: BigNumber;
    didPass: boolean;
}>;
export declare type CancelProposal = ParsedEvent<'CancelProposal', {
    proposalId: BigNumber;
    applicantAddress: string;
}>;
export declare type SubmitVote = ParsedEvent<'SubmitVote', {
    proposalId: BigNumber;
    proposalIndex: BigNumber;
    delegateKey: string;
    memberAddress: string;
    uintVote: number;
}>;
export declare type UpdateDelegateKey = ParsedEvent<'UpdateDelegateKey', {
    memberAddress: string;
    newDelegateKey: string;
}>;
export declare type DelegateChangeEvents = UpdateDelegateKey;
export declare type AnyProposalEvent = CancelProposal | ProcessProposal | SponsorProposal | SubmitProposal;
export declare class MolochGovernanceContract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Fetch all proposal created events from the governance contract
     */
    getAllProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<SubmitProposal>>>;
    /**
     * Get all proposal events
     */
    getProposalEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    /**
     * Fetch all vote events from governance contract
     */
    getAllVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<SubmitVote>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
}
