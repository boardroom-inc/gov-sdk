import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerInfo, CreateOnChainProposalAdapter, CallData, CreateOnChainProposalPayload, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, TransferEventPage, GeneralAdapter, CastVoteData, Proposal, VotePowerAdapter, CastVoteEncodedData, CastVoteEncodedResponse, Vote } from '@boardroom/gov-lib';
interface CompoundGovernorAlphaAdapterConfig {
    governanceAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    boardroomAPIKey?: string;
    etherscanMainnetAPIKey?: string;
}
/**
 * Proposals adapter for Compound Alpha Governor
 */
export declare class CompoundGovernorAlphaAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, CreateOnChainProposalAdapter, GeneralAdapter {
    private readonly governanceAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    private readonly etherscanMainnetAPIKey?;
    constructor(config: CompoundGovernorAlphaAdapterConfig);
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
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
    getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getTransferEvents(pagination?: PaginationOptions): Promise<TransferEventPage>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
    getContract(contractAddress: string): Promise<any>;
    getContractFunctions(contractAddress: string): Promise<string>;
    encodeCalldata(data: CallData): Promise<string>;
    /**
     * @param targets The ordered list of target addresses for calls to be made
     * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
     * @param signatures The ordered list of function signatures to be called
     * @param calldatas The ordered list of calldata to be passed to each call
     * @param description The proposal description of intended actions
     */
    createOnChainProposal(payload: CreateOnChainProposalPayload, identifier?: string): Promise<string>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
}
export {};
