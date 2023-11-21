import { ContractInterface } from 'ethers';
import { ProposalsAdapter, VoteAdapter, DelegationAdapter, TransportResolver, PaginationOptions, ProposalPage, VotePage, ExternalLink, ProposalEventPage, VotePowerAdapter, VotePowerInfo, Framework, DelegationEventPage, DelegationsInfo, TokenAddress, DelegationsGetter, BalanceInfo, CastVoteData, Proposal, CastVoteEncodedData, CastVoteEncodedResponse, Vote } from '@boardroom/gov-lib';
export declare const lockingVaultABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];
export declare const vestingVaultABI: ({
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
    name?: undefined;
    outputs?: undefined;
} | {
    anonymous: boolean;
    inputs: {
        indexed: boolean;
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    type: string;
    stateMutability?: undefined;
    outputs?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        components: {
            internalType: string;
            name: string;
            type: string;
        }[];
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
} | {
    inputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    name: string;
    outputs: {
        internalType: string;
        name: string;
        type: string;
    }[];
    stateMutability: string;
    type: string;
    anonymous?: undefined;
})[];
export declare type MappedProposalOffChainData = {
    proposalId: string;
    title: string;
    description: string;
    calldatas: string[];
    targets: string[];
};
export declare type ProposalOffChainData = {
    [proposalId: string]: {
        descriptionURL: string;
        targets: string[];
        calldatas: string[];
        title: string;
        sentenceSummary: string;
        paragraphSummary: string;
    };
};
declare type VotingVault = {
    address: string;
    abi: ContractInterface;
    getDelegations: DelegationsGetter;
};
interface CouncilAdapterConfig {
    coreVotingAddress: string;
    tokenAddress: string;
    transports: TransportResolver;
    protocolName: string;
    votingVaults: VotingVault[];
    proposalsOffChainDataURL: string;
    chainId?: number;
    boardroomAPIKey?: string;
}
export declare class CouncilAdapter implements ProposalsAdapter, VoteAdapter, VotePowerAdapter, DelegationAdapter {
    private readonly coreVotingAddress;
    private readonly tokenAddress;
    private readonly transports;
    private readonly protocolName;
    private readonly votingVaults;
    private readonly proposalsOffChainDataURL;
    private readonly chainId?;
    private readonly boardroomAPIKey?;
    constructor(config: CouncilAdapterConfig);
    getChainId(): Promise<number>;
    getSnapshotSpaceName(): Promise<string>;
    getExternalLink(): Promise<ExternalLink>;
    getFramework(): Promise<Framework>;
    getTokenAddress(): Promise<TokenAddress>;
    getProposalCreationFunctionsSelectors(): Promise<string[]>;
    getVotingFunctionsSelectors(): Promise<Record<string, string[]>>;
    getDelegationFunctionsSelectors(): Promise<string[]>;
    getProposalCreationContractAddress(): Promise<string>;
    getDelegationContractAddress(): Promise<string>;
    getVotingContractAddress(): Promise<string>;
    private getProposalsOffChainData;
    getProposals(pagination?: PaginationOptions): Promise<ProposalPage>;
    getProposalEvents(pagination?: PaginationOptions): Promise<ProposalEventPage>;
    getVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    private vaultQueryVotePower;
    getVotes(pagination?: PaginationOptions): Promise<VotePage>;
    getDelegationEvents(pagination?: PaginationOptions): Promise<DelegationEventPage>;
    private getLatestCursor;
    getDelegation(address: string): Promise<string>;
    getDelegations(addresses: string[]): Promise<DelegationsInfo[]>;
    delegateVotingPower(delegatee: string, identifier?: string): Promise<string>;
    getEncodedCastVoteData({ proposalId, choice }: CastVoteEncodedData): Promise<CastVoteEncodedResponse>;
    castVote(params: CastVoteData): Promise<string>;
    getBalance(addresses: string[], blockHeight?: number): Promise<BalanceInfo[]>;
    getDelegatableVotePower(addresses: string[], blockHeight?: number): Promise<VotePowerInfo[]>;
    getProposalFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Proposal>;
    getProposalIdFromEvent(): Promise<string>;
    getVoteFromEvent(blockNumber: number, transactionHash: string, event: string): Promise<Vote>;
}
export {};
