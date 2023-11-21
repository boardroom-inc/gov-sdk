import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, CreateOnChainProposalRequestId, CreateOnChainProposalPayload, CallData, CreateOnChainProposalAdapter, EncodedCallData, ContractFunctions, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, GeneralAdapter, TransferEventPage, CastVoteData, Proposal, CastVoteEncodedData, CastVoteEncodedResponse, Vote } from '@boardroom/gov-lib';
interface CompoundGovernorInterestAdapterConfig {
    governanceAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    alternateVoteDelegatorAddress?: string;
    boardroomAPIKey?: string;
    etherscanMainnetAPIKey?: string;
}
/**
 * Proposals adapter for Compound Bravo Governor
 */
export declare class CompoundGovernorInterestAdapter implements ProposalsAdapter, VoteAdapter, DelegationAdapter, VotePowerAdapter, CreateOnChainProposalAdapter, GeneralAdapter {
    private readonly governanceAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly alternateVoteDelegatorAddress?;
    private readonly boardroomAPIKey?;
    private readonly etherscanMainnetAPIKey?;
    constructor(config: CompoundGovernorInterestAdapterConfig);
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
    getGovernanceAddress(): Promise<string>;
    getTransports(): Promise<TransportResolver>;
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getEncodedCastVoteData({ proposalId, choice, reason }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
    getContract(contractAddress: string): Promise<any>;
    getContractFunctions(contractAddress: string): Promise<ContractFunctions>;
    encodeCalldata(data: CallData): Promise<EncodedCallData>;
    /**
     * @param targets The ordered list of target addresses for calls to be made
     * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
     * @param signatures The ordered list of function signatures to be called
     * @param calldatas The ordered list of calldata to be passed to each call
     * @param description The proposal description of intended actions
     */
    createOnChainProposal(payload: CreateOnChainProposalPayload, identifier?: string): Promise<CreateOnChainProposalRequestId>;
    getTransferEvents(pagination?: PaginationOptions): Promise<TransferEventPage>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
