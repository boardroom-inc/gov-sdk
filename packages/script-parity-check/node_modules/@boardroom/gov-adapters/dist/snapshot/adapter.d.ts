import { PaginationOptions, Proposal, ProposalPage, ProposalsAdapter, VoteAdapter, TransportResolver, Vote, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, ProposalTimeFormat, CreateProposalPayload, CreateProposalAdapter, DelegationAdapter, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, CastVoteData, CastVoteEncodedResponse } from '@boardroom/gov-lib';
import { SnapshotGraphProposal } from './graph';
import { Web3Provider } from '@ethersproject/providers';
/** handle some odd data that comes back from snapshot */
export declare const normalizeSnapshot: (snapshot: string | undefined) => number;
/**
 * Project snapshot's graph response into interop proposal shape
 */
export declare const mapGraphProposal: (ssProposal: SnapshotGraphProposal) => Proposal;
interface SnapshotAdapterConfig {
    spaceName: string;
    transports: TransportResolver;
    cname: string;
    chainId?: number;
    snapshotApiKey?: string;
    boardroomAPIKey?: string;
}
/**
 * Implement the proposals adapter via the snapshot API
 */
export declare class SnapshotAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, CreateProposalAdapter, DelegationAdapter {
    private readonly baseUrl;
    private readonly graph;
    private readonly protocolName;
    private readonly snapshotDelegatorAddress;
    private readonly spaceName;
    private readonly transports;
    private readonly cname;
    private readonly chainId?;
    private readonly snapshotApiKey?;
    private readonly boardroomAPIKey?;
    constructor(config: SnapshotAdapterConfig);
    getChainId(): Promise<number>;
    getTokenAddress(): Promise<TokenAddress>;
    getFramework(): Promise<Framework>;
    getSnapshotSpaceName(): Promise<string>;
    getProposalCreationFunctionsSelectors(): Promise<string[]>;
    getVotingFunctionsSelectors(): Promise<Record<string, string[]>>;
    getDelegationFunctionsSelectors(): Promise<string[]>;
    getProposalCreationContractAddress(): Promise<string>;
    getDelegationContractAddress(): Promise<string>;
    getVotingContractAddress(): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getExternalLink(): Promise<ExternalLink>;
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getProposalEvents(): Promise<ProposalEventPage>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
    getEncodedCastVoteData(): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getCanonicalProposalTimeFormat(): Promise<ProposalTimeFormat>;
    createProposal({ title, content, choices, startTime, endTime, blockNumber }: CreateProposalPayload, isContractWallet?: boolean, identifier?: string, web3?: Web3Provider): Promise<string>;
    private _getScoresAtBlock;
    private _getScores;
    private _encryptChoice;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
}
export {};
