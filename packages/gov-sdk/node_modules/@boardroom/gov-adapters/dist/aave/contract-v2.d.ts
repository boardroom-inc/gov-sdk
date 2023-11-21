import { BigNumber } from 'ethers';
import { PaginatedResponse, TransportResolver } from '@boardroom/gov-lib';
import { LogResult, ParsedEvent } from '../rpc';
export declare type ProposalCreated = ParsedEvent<'ProposalCreated', {
    id: BigNumber;
    calldatas: string[];
    creator: string;
    endBlock: BigNumber;
    executor: string;
    ipfsHash: string;
    signatures: string[];
    startBlock: BigNumber;
    strategy: string;
    targets: string[];
    values: BigNumber[];
    withDelegatecalls: string[];
}>;
export declare type ProposalCanceled = ParsedEvent<'ProposalCanceled', {
    id: BigNumber;
}>;
export declare type ProposalQueued = ParsedEvent<'ProposalQueued', {
    id: BigNumber;
    executionTime: BigNumber;
    initiatorQueueing: string;
}>;
export declare type ProposalExecuted = ParsedEvent<'ProposalExecuted', {
    id: BigNumber;
    executionTime: BigNumber;
    initiatorExecution: string;
}>;
export declare type VoteEmitted = ParsedEvent<'VoteEmitted', {
    id: BigNumber;
    voter: string;
    support: boolean;
    votingPower: BigNumber;
}>;
export declare type DelegateChanged = ParsedEvent<'DelegateChanged', {
    delegator: string;
    delegatee: string;
    delegationType: number;
}>;
export declare type DelegatedPowerChanged = ParsedEvent<'DelegatedPowerChanged', {
    user: string;
    amount: BigNumber;
    delegationType: number;
}>;
export declare type DelegateChangeEvents = DelegateChanged | DelegatedPowerChanged;
export declare type NonCreatedProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted;
export declare type AnyProposalEvent = ProposalCanceled | ProposalQueued | ProposalExecuted | ProposalCreated;
/**
 * IPFS content for a proposal
 *
 * eg: https://gateway.pinata.cloud/ipfs/QmNfU4FMdQriJVQeqQTNxgY63iSJVh8yCJf8aFDkQDjaLQ
 */
export interface ProposalContent {
    title: string;
    shortDescription: string;
    description: string;
}
export declare type TransferEvents = ParsedEvent<'Transfer', {
    from: string;
    to: string;
    value: BigNumber;
}>;
export declare class AaveGovernanceV2Contract {
    private readonly address;
    private readonly transports;
    constructor(address: string, transports: TransportResolver);
    /**
     * Resolve the proposal content from IPFS
     */
    getProposalContent(ipfsHash: string): Promise<ProposalContent>;
    /**
     * Fetch all proposal created events from the governance contract
     */
    getAllProposalCreatedEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<ProposalCreated>>>;
    /**
     * Get all proposal events
     */
    getAllProposalEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<AnyProposalEvent>>>;
    /**
     * Fetch all vote events from governance contract
     */
    getAllVoteEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<VoteEmitted>>>;
    /**
     * Get all delegation events
     */
    getDelegationEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<DelegateChangeEvents>>>;
    /**
     * Get all transfer events
     */
    getTransferEvents(chainId: number, cursor?: string, startBlock?: number, endBlock?: number): Promise<PaginatedResponse<LogResult<TransferEvents>>>;
}
