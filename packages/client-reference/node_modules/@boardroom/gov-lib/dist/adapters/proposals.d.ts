import { Static } from '@sinclair/typebox';
import { PaginationOptions } from '../pagination';
import { ResponseValidator } from '../validation';
import { ChainId, ExternalLink, Framework, FunctionsSelectors, Address } from './common';
/**
 * A state that a proposal can be in
 */
export declare type ProposalState = Static<typeof ProposalState>;
export declare const ProposalState: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"pending">, import("@sinclair/typebox").TLiteral<"active">, import("@sinclair/typebox").TLiteral<"closed">, import("@sinclair/typebox").TLiteral<"canceled">, import("@sinclair/typebox").TLiteral<"queued">, import("@sinclair/typebox").TLiteral<"executed">]>;
/**
 * A proposal can have zero or more "events" occur at a specific time
 */
export declare type ProposalEvent = Static<typeof ProposalEvent>;
export declare const ProposalEvent: import("@sinclair/typebox").TObject<{
    proposalId: import("@sinclair/typebox").TString;
    state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"pending">, import("@sinclair/typebox").TLiteral<"active">, import("@sinclair/typebox").TLiteral<"closed">, import("@sinclair/typebox").TLiteral<"canceled">, import("@sinclair/typebox").TLiteral<"queued">, import("@sinclair/typebox").TLiteral<"executed">]>;
    time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        blockNumber: import("@sinclair/typebox").TInteger;
    }>]>;
    txHash: import("@sinclair/typebox").TString;
}>;
/**
 * A paginated list of proposal events
 */
export declare type ProposalEventPage = Static<typeof ProposalEventPage>;
export declare const ProposalEventPage: import("@sinclair/typebox").TObject<{
    items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        proposalId: import("@sinclair/typebox").TString;
        state: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"pending">, import("@sinclair/typebox").TLiteral<"active">, import("@sinclair/typebox").TLiteral<"closed">, import("@sinclair/typebox").TLiteral<"canceled">, import("@sinclair/typebox").TLiteral<"queued">, import("@sinclair/typebox").TLiteral<"executed">]>;
        time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            timestamp: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            blockNumber: import("@sinclair/typebox").TInteger;
        }>]>;
        txHash: import("@sinclair/typebox").TString;
    }>>;
    nextCursor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
/**
 * A single proposal entity
 */
export declare type Proposal = Static<typeof Proposal>;
export declare const Proposal: import("@sinclair/typebox").TObject<{
    id: import("@sinclair/typebox").TString;
    title: import("@sinclair/typebox").TString;
    proposer: import("@sinclair/typebox").TString;
    externalUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    content: import("@sinclair/typebox").TString;
    choices: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    blockNumber: import("@sinclair/typebox").TNumber;
    startTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        blockNumber: import("@sinclair/typebox").TInteger;
    }>]>;
    endTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        blockNumber: import("@sinclair/typebox").TInteger;
    }>]>;
    type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    scores: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        choice: import("@sinclair/typebox").TString;
        total: import("@sinclair/typebox").TString;
    }>>>;
    status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    summary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    privacy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    executables: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        target: import("@sinclair/typebox").TString;
        signature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        calldata: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
        params: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
    }>>>;
    quorum: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
    txHash: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    executionArgs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        targets: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        values: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>>;
        signatures: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
        calldatas: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        description: import("@sinclair/typebox").TString;
    }>>;
    votingModule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    flagged: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
}>;
/**
 * A paginated list of proposals
 */
export declare type ProposalPage = Static<typeof ProposalPage>;
export declare const ProposalPage: import("@sinclair/typebox").TObject<{
    items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        id: import("@sinclair/typebox").TString;
        title: import("@sinclair/typebox").TString;
        proposer: import("@sinclair/typebox").TString;
        externalUrl: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        content: import("@sinclair/typebox").TString;
        choices: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
        blockNumber: import("@sinclair/typebox").TNumber;
        startTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            timestamp: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            blockNumber: import("@sinclair/typebox").TInteger;
        }>]>;
        endTime: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            timestamp: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            blockNumber: import("@sinclair/typebox").TInteger;
        }>]>;
        type: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        scores: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            choice: import("@sinclair/typebox").TString;
            total: import("@sinclair/typebox").TString;
        }>>>;
        status: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        summary: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        privacy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        executables: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
            target: import("@sinclair/typebox").TString;
            signature: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
            calldata: import("@sinclair/typebox").TString;
            value: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
            params: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TString>>;
        }>>>;
        quorum: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TInteger>;
        txHash: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        executionArgs: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
            targets: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            values: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>>;
            signatures: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
            calldatas: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
            description: import("@sinclair/typebox").TString;
        }>>;
        votingModule: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        flagged: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TBoolean>;
    }>>;
    nextCursor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
/**
 * A single vote cast on a proposal
 */
export declare type Vote = Static<typeof Vote>;
export declare const Vote: import("@sinclair/typebox").TObject<{
    time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        blockNumber: import("@sinclair/typebox").TInteger;
    }>]>;
    proposalId: import("@sinclair/typebox").TString;
    address: import("@sinclair/typebox").TString;
    choice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>, import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber>]>>;
    power: import("@sinclair/typebox").TNumber;
    reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    privacy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    txHash: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
/**
 * A page of votes cast for a proposal
 */
export declare type VotePage = Static<typeof VotePage>;
export declare const VotePage: import("@sinclair/typebox").TObject<{
    items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
            timestamp: import("@sinclair/typebox").TInteger;
        }>, import("@sinclair/typebox").TObject<{
            blockNumber: import("@sinclair/typebox").TInteger;
        }>]>;
        proposalId: import("@sinclair/typebox").TString;
        address: import("@sinclair/typebox").TString;
        choice: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TInteger, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TNumber>, import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TNumber, import("@sinclair/typebox").TNumber>]>>;
        power: import("@sinclair/typebox").TNumber;
        reason: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        privacy: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
        txHash: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
    }>>;
    nextCursor: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TString>;
}>;
/**
 * Adapter for a protocol that has queryable proposals
 */
export interface ProposalsAdapter {
    getFramework: () => Promise<Framework>;
    getProposals: (pagination?: PaginationOptions) => Promise<ProposalPage>;
    getProposalEvents: (pagination?: PaginationOptions) => Promise<ProposalEventPage>;
    getVotes: (pagination?: PaginationOptions) => Promise<VotePage>;
    getExternalLink: () => Promise<ExternalLink>;
    getChainId: () => Promise<ChainId>;
    getProposalCreationFunctionsSelectors: () => Promise<FunctionsSelectors>;
    getProposalCreationContractAddress: () => Promise<Address>;
    getSnapshotSpaceName: () => Promise<string>;
    getProposalFromEvent: (blockNumber: number, transactionHash: string, event: string) => Promise<Proposal>;
    getProposalIdFromEvent: (event: string) => Promise<string>;
    getVoteFromEvent: (blockNumber: number, transactionHash: string, event: string) => Promise<Vote>;
}
export declare const proposalsAdapterValidators: ResponseValidator<ProposalsAdapter>;
