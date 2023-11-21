import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, CastVoteData, CastVoteEncodedData, CastVoteEncodedResponse, Proposal, Vote } from '@boardroom/gov-lib';
interface MolochGovernorAdapterConfig {
    governanceAddress: string;
    transports: TransportResolver;
    chainId?: number;
    protocolName: string;
    boardroomAPIKey?: string;
}
/**
 * Proposals adapter for Moloch Governor
 */
export declare class MolochGovernorAdapter implements ProposalsAdapter, VotePowerAdapter, VoteAdapter, DelegationAdapter {
    private readonly governanceAddress;
    private readonly transports;
    private readonly chainId?;
    private readonly protocolName;
    private readonly boardroomAPIKey?;
    constructor(config: MolochGovernorAdapterConfig);
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
    getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
