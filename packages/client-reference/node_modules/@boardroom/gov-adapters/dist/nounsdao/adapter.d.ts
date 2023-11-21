import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, BalanceInfo, GeneralAdapter, TransferEventPage, CreateOnChainProposalAdapter, CreateOnChainProposalPayload, CreateOnChainProposalRequestId, CallData, EncodedCallData, ContractFunctions, CastVoteData, Proposal, CastVoteEncodedData, CastVoteEncodedResponse, Vote } from '@boardroom/gov-lib';
interface NounsGovernorAdapterConfig {
    governanceAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    alternateQuorumContract?: boolean;
    boardroomAPIKey?: string;
    etherscanMainnetAPIKey?: string;
}
/**
 * Proposals adapter for Nouns DAO Governor
 */
export declare class NounsGovernorAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter, GeneralAdapter, CreateOnChainProposalAdapter {
    private readonly governanceAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly alternateQuorumContract?;
    private readonly boardroomAPIKey?;
    private readonly etherscanMainnetAPIKey?;
    constructor(config: NounsGovernorAdapterConfig);
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
    /**
     * @param targets The ordered list of target addresses for calls to be made
     * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
     * @param signatures The ordered list of function signatures to be called
     * @param calldatas The ordered list of calldata to be passed to each call
     * @param description The proposal description of intended actions
     */
    createOnChainProposal(payload: CreateOnChainProposalPayload, identifier?: string): Promise<CreateOnChainProposalRequestId>;
    encodeCalldata(data: CallData): Promise<EncodedCallData>;
    getContractFunctions(contractAddress: string): Promise<ContractFunctions>;
    getContract(contractAddress: string): Promise<any>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
}
export {};
