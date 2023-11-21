import { ProposalsAdapter, VoteAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, DelegationAdapter, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, GeneralAdapter, TransferEventPage, CastVoteData, Proposal, CastVoteEncodedResponse, CastVoteEncodedData, Vote } from '@boardroom/gov-lib';
export interface AaveContracts {
    governance: string;
    token: string;
    strategy: string;
}
interface AaveGovernanceV2AdapterConfig {
    contracts: AaveContracts;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    boardroomAPIKey?: string;
}
/**
 * Proposals adapter for Compound Alpha Governor
 */
export declare class AaveGovernanceV2Adapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, GeneralAdapter {
    private readonly contracts;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    constructor(config: AaveGovernanceV2AdapterConfig);
    getChainId(): Promise<number>;
    getSnapshotSpaceName(): Promise<string>;
    getTokenAddress(): Promise<TokenAddress>;
    getExternalLink(): Promise<ExternalLink>;
    getProposalCreationFunctionsSelectors(): Promise<string[]>;
    getVotingFunctionsSelectors(): Promise<Record<string, string[]>>;
    getDelegationFunctionsSelectors(): Promise<string[]>;
    getProposalCreationContractAddress(): Promise<string>;
    getDelegationContractAddress(): Promise<string>;
    getVotingContractAddress(): Promise<string>;
    getFramework(): Promise<Framework>;
    /**
     * Cannot paginate aave proposals
     */
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    /**
     * We can paginate vote events but we cant filter by proposal
     */
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
    getTransferEvents(pagination?: PaginationOptions): Promise<TransferEventPage>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
