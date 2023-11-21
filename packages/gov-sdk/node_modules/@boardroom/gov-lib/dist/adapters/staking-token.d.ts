import { ResponseValidator } from '../validation';
import { ChainId } from './common';
/**
 * Request ID used to check the status of a staking request
 */
export declare type TransactionHash = string;
export declare const TransactionHash: import("@sinclair/typebox").TString;
export declare type Allowance = string;
export declare const Allowance: import("@sinclair/typebox").TString;
/**
 * Expose a method to stake tokens
 */
export interface StakingTokenAdapter {
    getAllowance: (address: string) => Promise<Allowance>;
    approve: (amountToApprove: string) => Promise<TransactionHash>;
    stake: (address: string, amountToStake: string) => Promise<TransactionHash>;
    unStake: (address: string, amountToUnStake: string) => Promise<TransactionHash>;
    getStakedTokenBalance: (address: string) => Promise<string>;
    getTokenBalance: (address: string) => Promise<string>;
    getChainId: () => Promise<ChainId>;
}
export declare const stakingAdapterValidators: ResponseValidator<StakingTokenAdapter>;
