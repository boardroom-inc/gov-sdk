import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, DelegationEventPage, DelegationsInfo, Proposal, Vote, TokenAddress, BalanceInfo, CastVoteData, CastVoteEncodedData, CastVoteEncodedResponse } from '@boardroom/gov-lib';
interface MakerDaoGovernorExecutiveAdapterConfig {
    chiefAddress: string;
    tokenAddress: string;
    voteDelegateFactoryAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    boardroomAPIKey?: string;
}
/**
 * Proposals adapter for MakerDao Governor
 */
export declare class MakerDaoGovernorExecutiveAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter, DelegationAdapter {
    private readonly chiefAddress;
    private readonly tokenAddress;
    private readonly voteDelegateFactoryAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    constructor(config: MakerDaoGovernorExecutiveAdapterConfig);
    getChainId(): Promise<number>;
    getSnapshotSpaceName(): Promise<string>;
    getTokenAddress(): Promise<TokenAddress>;
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
    getEncodedCastVoteData({ proposalId, reason, address }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    private _hasDelegateProxy;
    private _getDelegateProxyAddress;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    private _getChiefDeposits;
    getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
