import {
  Currency,
  CurrencyAmount,
  CurrencyTokenBalancesInfo,
  TransactionsResponse,
  Addresses,
  TransfersResponse,
} from './common';
import { compileAdapterValidator } from '../adapter-validator';
import { ResponseValidator } from '../validation';

/**
 * Expose information about a protocol's treasury
 */
export interface TreasuryAdapter {
  getTreasuryAddresses: () => Promise<Addresses>;
  getBalance: (currency: Currency) => Promise<CurrencyAmount>;
  getTransactions: (currency: Currency, pageNumber?: number, treasuryAddress?: string) => Promise<TransactionsResponse>;
  getTransfers: (
    treasuryAddress: string,
    tokenAddress: string,
    currency: Currency,
    pageNumber?: number
  ) => Promise<TransfersResponse>;
  getTokenBalances: (currency: Currency) => Promise<CurrencyTokenBalancesInfo>;
}

export const treasuryAdapterValidators: ResponseValidator<TreasuryAdapter> = {
  getTreasuryAddresses: compileAdapterValidator(Addresses),
  getBalance: compileAdapterValidator(CurrencyAmount),
  getTransactions: compileAdapterValidator(TransactionsResponse),
  getTransfers: compileAdapterValidator(TransfersResponse),
  getTokenBalances: compileAdapterValidator(CurrencyTokenBalancesInfo),
};
