import { ProposalsAdapter, VoteAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, Proposal, Vote, BalanceInfo, CastVoteData, CastVoteEncodedData, CastVoteEncodedResponse } from '@boardroom/gov-lib';
interface MakerDaoGovernorPollingAdapterConfig {
    chiefAddress: string;
    pollingAddress: string;
    tokenAddress: string;
    voteProxyFactoryAddress: string;
    voteDelegateFactoryAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    boardroomAPIKey?: string;
}
/**
 * Proposals adapter for MakerDao Governor
 */
export declare class MakerDaoGovernorPollingAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter {
    private readonly chiefAddress;
    private readonly pollingAddress;
    private readonly tokenAddress;
    private readonly voteProxyFactoryAddress;
    private readonly voteDelegateFactoryAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    constructor(config: MakerDaoGovernorPollingAdapterConfig);
    getChainId(): Promise<number>;
    getSnapshotSpaceName(): Promise<string>;
    getExternalLink(): Promise<ExternalLink>;
    getFramework(): Promise<Framework>;
    getProposalCreationFunctionsSelectors(): Promise<string[]>;
    getVotingFunctionsSelectors(): Promise<Record<string, string[]>>;
    getDelegationFunctionsSelectors(): Promise<string[]>;
    getProposalCreationContractAddress(): Promise<string>;
    getDelegationContractAddress(): Promise<string>;
    getVotingContractAddress(): Promise<string>;
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getEncodedCastVoteData({ proposalId, choice, address }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    private _hasDelegateProxy;
    private _getDelegateProxyAddress;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    private _hasProxy;
    private _getWalletFromVoteProxy;
    private _getWalletMap;
    private _getChiefDeposits;
    private _getBalanceOf;
    getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
