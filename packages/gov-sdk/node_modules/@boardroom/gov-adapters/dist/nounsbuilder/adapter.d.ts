import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, GeneralAdapter, TransferEventPage, CastVoteData, Proposal, CastVoteEncodedData, CastVoteEncodedResponse, Vote } from '@boardroom/gov-lib';
interface NounsBuilderAdapterConfig {
    governanceAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    boardroomAPIKey?: string;
}
/**
 * Proposals adapter for Nouns Builder Governor
 */
export declare class NounsBuilderAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, GeneralAdapter {
    private readonly governanceAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    constructor(config: NounsBuilderAdapterConfig);
    getChainId(): Promise<number>;
    getSnapshotSpaceName(): Promise<string>;
    getTokenAddress(): Promise<TokenAddress>;
    getProposalCreationFunctionsSelectors(): Promise<string[]>;
    getVotingFunctionsSelectors(): Promise<Record<string, string[]>>;
    getDelegationFunctionsSelectors(): Promise<string[]>;
    getProposalCreationContractAddress(): Promise<string>;
    getDelegationContractAddress(): Promise<string>;
    getVotingContractAddress(): Promise<string>;
    getExternalLink(): Promise<ExternalLink>;
    getFramework(): Promise<Framework>;
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
    getEncodedCastVoteData({ proposalId, choice, reason }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
    getTransferEvents(pagination?: PaginationOptions): Promise<TransferEventPage>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
}
export {};
