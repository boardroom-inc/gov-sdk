import { Static } from '@sinclair/typebox';
import { PaginationOptions } from '../pagination';
import { ResponseValidator } from '../validation';
import { ContractInterface } from 'ethers';
import { ChainId, Framework, FunctionsSelectors, Address } from './common';
/**
 * Request ID used to check the status of a delegate voting power transaction
 */
export declare type DelegateVotingPowerRequestId = string;
export declare const DelegateVotingPowerRequestId: import("@sinclair/typebox").TString;
/**
 * Various event types
 */
export declare type EventType = Static<typeof EventType>;
export declare const EventType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DELEGATED">, import("@sinclair/typebox").TLiteral<"UNDELEGATED">, import("@sinclair/typebox").TLiteral<"MOVED">, import("@sinclair/typebox").TLiteral<"VOTING_POWER">, import("@sinclair/typebox").TLiteral<"PROPOSITION_POWER">, import("@sinclair/typebox").TLiteral<"NONE">]>;
/**
 * A delegation can have zero or more "events" occur at a specific time
 */
export declare type DelegationEvent = Static<typeof DelegationEvent>;
export declare const DelegationEvent: import("@sinclair/typebox").TObject<{
    delegator: import("@sinclair/typebox").TString;
    fromDelegate: import("@sinclair/typebox").TString;
    toDelegate: import("@sinclair/typebox").TString;
    amount: import("@sinclair/typebox").TString;
    aaveDelegationType: import("@sinclair/typebox").TString;
    snapshotId: import("@sinclair/typebox").TString;
    eventType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DELEGATED">, import("@sinclair/typebox").TLiteral<"UNDELEGATED">, import("@sinclair/typebox").TLiteral<"MOVED">, import("@sinclair/typebox").TLiteral<"VOTING_POWER">, import("@sinclair/typebox").TLiteral<"PROPOSITION_POWER">, import("@sinclair/typebox").TLiteral<"NONE">]>;
    time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
        timestamp: import("@sinclair/typebox").TInteger;
    }>, import("@sinclair/typebox").TObject<{
        blockNumber: import("@sinclair/typebox").TInteger;
    }>]>;
    txHash: import("@sinclair/typebox").TString;
}>;
/**
 * A paginated list of delegation events
 */
export declare type DelegationEventPage = Static<typeof DelegationEventPage>;
export declare const DelegationEventPage: import("@sinclair/typebox").TObject<{
    items: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        delegator: import("@sinclair/typebox").TString;
        fromDelegate: import("@sinclair/typebox").TString;
        toDelegate: import("@sinclair/typebox").TString;
        amount: import("@sinclair/typebox").TString;
        aaveDelegationType: import("@sinclair/typebox").TString;
        snapshotId: import("@sinclair/typebox").TString;
        eventType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"DELEGATED">, import("@sinclair/typebox").TLiteral<"UNDELEGATED">, import("@sinclair/typebox").TLiteral<"MOVED">, import("@sinclair/typebox").TLiteral<"VOTING_POWER">, import("@sinclair/typebox").TLiteral<"PROPOSITION_POWER">, import("@sinclair/typebox").TLiteral<"NONE">]>;
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
 * Delegation info for multiple addresses
 */
export declare type DelegationsInfo = Static<typeof DelegationsInfo>;
export declare const DelegationsInfo: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    addressDelegatedTo: import("@sinclair/typebox").TString;
}>;
/**
 * Address of who an address is delegating to
 */
export declare type DelegateAddress = string;
export declare const DelegateAddress: import("@sinclair/typebox").TString;
/**
 * Address of the token used to delegate
 */
export declare type TokenAddress = string;
export declare const TokenAddress: import("@sinclair/typebox").TString;
export declare type DelegationsGetter = (addresses: string[], vaultAbi: ContractInterface, vaultAddress: string, rpc: any) => Promise<DelegationsInfo[]>;
/**
 * Expose a method to delegate voting power to an address
 */
export interface DelegationAdapter {
    getFramework: () => Promise<Framework>;
    delegateVotingPower: (address: string, identifier?: string, amount?: number) => Promise<DelegateVotingPowerRequestId>;
    getDelegationEvents: (pagination?: PaginationOptions) => Promise<DelegationEventPage>;
    getDelegation: (address: string) => Promise<DelegateAddress>;
    getDelegations: (addresses: string[]) => Promise<DelegationsInfo[]>;
    getChainId: () => Promise<ChainId>;
    getTokenAddress: () => Promise<TokenAddress>;
    getDelegationFunctionsSelectors: () => Promise<FunctionsSelectors>;
    getDelegationContractAddress: () => Promise<Address>;
}
export declare const delegationAdapterValidators: ResponseValidator<DelegationAdapter>;
