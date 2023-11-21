import { Static } from '@sinclair/typebox';
import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';
/**
 * Vote power for a specific address
 */
export declare type VotePowerInfo = Static<typeof VotePowerInfo>;
export declare const VotePowerInfo: import("@sinclair/typebox").TObject<{
    protocol: import("@sinclair/typebox").TString;
    address: import("@sinclair/typebox").TString;
    power: import("@sinclair/typebox").TNumber;
}>;
export declare type BalanceInfo = Static<typeof BalanceInfo>;
export declare const BalanceInfo: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    balance: import("@sinclair/typebox").TNumber;
}>;
/**
 * Address wallet map
 */
export declare type WalletMapInfo = Static<typeof WalletMapInfo>;
export declare const WalletMapInfo: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    wallet: import("@sinclair/typebox").TString;
}>;
/**
 * An adapter that can be used to query the vote power for a set of addresses
 */
export interface VotePowerAdapter {
    /**
     * Resolve voting power for an array of addreses at an (optionally provided)
     * block height.
     *
     * If an address does not have voting power at the specified
     * block height, it wont be returned in the array of results
     */
    getVotePower(addresses: string[], blockHeight?: number, proposalId?: string): Promise<VotePowerInfo[]>;
    getDelegatableVotePower: (addresses: string[], blockHeight?: number) => Promise<VotePowerInfo[]>;
    getFramework: () => Promise<Framework>;
    getChainId: () => Promise<ChainId>;
    getBalance(addresses: string[]): Promise<BalanceInfo[]>;
}
export declare const votePowerAdapterValidators: ResponseValidator<VotePowerAdapter>;
