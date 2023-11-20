import { Static, Type } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ChainId, Framework } from './common';

/**
 * Vote power for a specific address
 */
export type VotePowerInfo = Static<typeof VotePowerInfo>;
export const VotePowerInfo = Type.Object({
  protocol: Type.String(),
  address: Type.String(),
  power: Type.Number(),
});

export type BalanceInfo = Static<typeof BalanceInfo>;
export const BalanceInfo = Type.Object({
  address: Type.String(),
  balance: Type.Number(),
});
/**
 * Address wallet map
 */
export type WalletMapInfo = Static<typeof WalletMapInfo>;
export const WalletMapInfo = Type.Object({
  address: Type.String(),
  wallet: Type.String(),
});

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

export const votePowerAdapterValidators: ResponseValidator<VotePowerAdapter> = {
  getFramework: compileAdapterValidator(Framework),
  getVotePower: compileAdapterValidator(Type.Array(VotePowerInfo)),
  getDelegatableVotePower: compileAdapterValidator(Type.Array(VotePowerInfo)),
  getChainId: compileAdapterValidator(ChainId),
  getBalance: compileAdapterValidator(Type.Array(BalanceInfo)),
};
