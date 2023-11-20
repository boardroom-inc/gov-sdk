import { Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId } from './common';
/**
 * Request ID used to check the status of a staking request
 */
export type TransactionHash = string;
export const TransactionHash = Type.String();

export type Allowance = string;
export const Allowance = Type.String();

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

export const stakingAdapterValidators: ResponseValidator<StakingTokenAdapter> = {
  getAllowance: compileAdapterValidator(Allowance),
  approve: compileAdapterValidator(TransactionHash),
  stake: compileAdapterValidator(TransactionHash),
  unStake: compileAdapterValidator(TransactionHash),
  getStakedTokenBalance: compileAdapterValidator(Type.String()),
  getTokenBalance: compileAdapterValidator(Type.String()),
  getChainId: compileAdapterValidator(ChainId),
};
