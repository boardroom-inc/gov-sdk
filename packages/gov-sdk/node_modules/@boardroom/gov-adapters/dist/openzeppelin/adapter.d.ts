import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, CallData, CreateOnChainProposalPayload, CreateOnChainProposalAdapter, Framework, DelegationEventPage, DelegationsInfo, BalanceInfo, TokenAddress, GeneralAdapter, TransferEventPage, CastVoteData, Proposal, JsonRpcTransport, CastVoteEncodedData, CastVoteEncodedResponse, ProposalExecutionAdapter, ExecutionPayload, Vote } from '@boardroom/gov-lib';
interface OpenZeppelinGovernorAdapterConfig {
    governanceAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    chainId?: number;
    isTokenERC721?: boolean;
    alternateDelegationAddress?: string;
    useTokenAddressForVotePower?: boolean;
    alternateVotePowerFunctionName?: string;
    decimals?: number;
    boardroomAPIKey?: string;
    etherscanMainnetAPIKey?: string;
    etherscanOptimismAPIKey?: string;
}
/**
 * Proposals adapter for OpenZeppelin Governor
 */
export declare class OpenZeppelinGovernorAdapter implements ProposalsAdapter, VoteAdapter, DelegationAdapter, VotePowerAdapter, CreateOnChainProposalAdapter, ProposalExecutionAdapter, GeneralAdapter {
    private readonly governanceAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly chainId?;
    private readonly isTokenERC721?;
    private readonly alternateDelegationAddress?;
    private readonly useTokenAddressForVotePower?;
    private readonly alternateVotePowerFunctionName?;
    private readonly decimals;
    private readonly boardroomAPIKey?;
    private readonly etherscanMainnetAPIKey?;
    private readonly etherscanOptimismAPIKey?;
    constructor(config: OpenZeppelinGovernorAdapterConfig);
    getTimeDelay(): Promise<number>;
    queueProposal(payload: ExecutionPayload): Promise<string>;
    executeProposal(payload: ExecutionPayload): Promise<string>;
    cancelProposal(payload: ExecutionPayload): Promise<string>;
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
    getSignatureList(targets: string[], calldatas: string[]): Promise<string[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getQuorum(rpc: JsonRpcTransport, blockNumber: number): Promise<number>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getProposalIdFromEvent(data: any): Promise<string>;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
    getEncodedCastVoteData({ proposalId, choice, reason }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    formatTokenAmount: (balance: any) => number;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getContract(contractAddress: string): Promise<any>;
    getContractFunctions(contractAddress: string): Promise<string>;
    encodeCalldata(data: CallData): Promise<string>;
    /**
     * @param targets The ordered list of target addresses for calls to be made
     * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
     * @param signatures openzeppelin governor doesn't use this field
     * @param calldatas The ordered list of calldata to be passed to each call
     * @param description The proposal description of intended actions
     */
    createOnChainProposal(payload: CreateOnChainProposalPayload, identifier?: string): Promise<string>;
    getTransferEvents(pagination?: PaginationOptions): Promise<TransferEventPage>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
}
export {};
