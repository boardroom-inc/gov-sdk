import { Type, Static } from '@sinclair/typebox';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';
import { ContractAddress, Currency, CurrencyAmount, Network } from './common';

/**
 * Basic information about a fungible token
 */
export type TokenInfo = Static<typeof TokenInfo>;
export const TokenInfo = Type.Object({
  symbol: Type.String(),
  contractAddress: ContractAddress,
  currentMarketPrice: CurrencyAmount,
  circulatingSupply: Type.Optional(Type.Number()),
  totalSupply: Type.Optional(Type.Number()),
  maxSupply: Type.Optional(Type.Number()),
});

/**
 * Adapter that can surface token information
 */
export interface TokenAdapter {
  /**
   * Get information about a token. Network only required for multi-chain tokens
   */
  getInfo: (currency?: Currency, network?: Network) => Promise<TokenInfo>;
}

export const tokenAdapterValidators: ResponseValidator<TokenAdapter> = {
  getInfo: compileAdapterValidator(TokenInfo),
};
