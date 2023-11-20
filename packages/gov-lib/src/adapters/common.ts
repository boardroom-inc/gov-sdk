import { Type, Static } from '@sinclair/typebox';

/**
 * External link / URL
 */
export type ExternalLink = Static<typeof ExternalLink>;
export const ExternalLink = Type.Object({
  url: Type.String(),
  name: Type.String(),
});

/**
 * ChainId to use for actions
 */
 export type ChainId = Static<typeof ChainId>;
 export const ChainId = Type.Number();

/**
 * Blockchain network
 */
export type Network = Static<typeof Network>;
export const Network = Type.Union([
  Type.Literal('ethereum'),
  Type.Literal('polygon-pos'),
  Type.Literal('binance-smart-chain'),
  Type.Literal('optimistic-ethereum'),
  Type.Literal('arbitrum-one')
  // additional chains go here.
]);

/**
 * Framework
 */
export type Framework = Static<typeof Framework>;
export const Framework = Type.Union([
  Type.Literal('snapshot'),
  Type.Literal('aave'),
  Type.Literal('openZeppelin'),
  Type.Literal('compoundAlpha'),
  Type.Literal('compoundBravo'),
  Type.Literal('nouns'),
  Type.Literal('moloch'),
  Type.Literal('tornadoCash'),
  Type.Literal('makerDaoPolling'),
  Type.Literal('makerDaoExecutive'),
  Type.Literal('council'),
  Type.Literal('nounsBuilder'),
  // additional frameworks go here
]);

/**
 * Adapter instance type
 */
export type AdapterInstanceType = Static<typeof AdapterInstanceType>;
export const AdapterInstanceType = Type.Union([
  Type.Literal('snapshot'),
  Type.Literal('onchain'),
  Type.Literal('onchain-secondary'),
  Type.Literal('onchain-optimism'),
  Type.Literal('onchain-arbitrum'),
  Type.Literal('archive'),
  Type.Literal('archiveAlpha'), // Shouldn't be used much, only here for legacy reasons
]);

export type Address = Static<typeof Address>;
export const Address = Type.String();

export type Addresses = Static<typeof Addresses>;
export const Addresses = Type.Object({
  addresses: Type.Array(Type.String()),
});

/**
 * Smart contract address on the block chain
 */
export type ContractAddress = Static<typeof ContractAddress>;
export const ContractAddress = Type.Object({
  network: Network,
  address: Type.String(),
});

/**
 * Types of supported currencies
 */
export type Currency = Static<typeof Currency>;
export const Currency = Type.Union([
  Type.Literal('usd'),
  // additional currencies go here
]);

/**
 * An amount with a currency unit
 */
export type CurrencyAmount = Static<typeof CurrencyAmount>;
export const CurrencyAmount = Type.Object({
  currency: Currency,
  amount: Type.Number(),
});

/**
 * A datetime can be expressed as either a unix timestamp or a blockchain block
 * number
 */
export type Time = Static<typeof Time>;
export const Time = Type.Union([
  Type.Object({
    timestamp: Type.Integer(),
  }),
  Type.Object({
    blockNumber: Type.Integer(),
  }),
]);

/**
 * Evaluate an expression comparing the numerical values of two Times.  Throws
 * if not of the same type
 */
export const compareTime = (a: Time, b: Time, compare: (a: number, b: number) => unknown): boolean => {
  if ('blockNumber' in a && 'blockNumber' in b) {
    return Boolean(compare(a.blockNumber, b.blockNumber));
  } else if ('timestamp' in a && 'timestamp' in b) {
    return Boolean(compare(a.timestamp, b.timestamp));
  }
  throw new Error();
};

/**
 * Tokens balance info
 */
export type TokenBalancesInfo = Static<typeof TokenBalancesInfo>;
export const TokenBalancesInfo = Type.Object({
  tokenBalance: Type.String(),
  balance: Type.Number(),
  tokenContractAddress: Type.String(),
  tokenDecimals: Type.Number(),
  tokenName: Type.String(),
  tokenSymbol: Type.String(),
  tokenLogoUrl: Type.String(),
});

/**
 * Tokens balance info along with currency unit
 */
export type CurrencyTokenBalancesInfo = Static<typeof CurrencyTokenBalancesInfo>;
export const CurrencyTokenBalancesInfo = Type.Object({
  currency: Currency,
  tokenBalances: Type.Array(TokenBalancesInfo),
});

/**
 * Transaction object
 */
export type Transaction = Static<typeof Transaction>;
export const Transaction = Type.Object({
  address: Type.String(),
  chainId: Type.Integer(),
  txnHash: Type.String(),
  value: Type.String(),
  fromAddress: Type.String(),
  toAddress: Type.String(),
  gasSpent: Type.Integer(),
  blockHeight: Type.Integer(),
});

export type Transactions = Array<Transaction>;
export const Transactions = Type.Array(Transaction);

export type TransactionsResponse = Static<typeof TransactionsResponse>;
export const TransactionsResponse = Type.Object({
  transactions: Transactions,
  pageNumber: Type.Integer(),
  hasMorePages: Type.Boolean(),
});

/**
 * Transfer object
 */
export type Transfer = Static<typeof Transfer>;
export const Transfer = Type.Object({
  address: Type.String(),
  chainId: Type.Integer(),
  txnHash: Type.String(),
  value: Type.String(),
  gasSpent: Type.Integer(),
  blockHeight: Type.Integer(),
  transfer: Type.Object({
    from_address: Type.String(),
    to_address: Type.String(),
    delta_quote: Type.String(),
    transfer_type: Type.String(),
    contract_ticker_symbol: Type.String(),
    contract_address: Type.String(),
  }),
});

export type Transfers = Array<Transfer>;
export const Transfers = Type.Array(Transfer);

export type TransfersResponse = Static<typeof TransfersResponse>;
export const TransfersResponse = Type.Object({
  transfers: Transfers,
  pageNumber: Type.Integer(),
  hasMorePages: Type.Boolean(),
});

export type FunctionsSelectors = string[];
export const FunctionsSelectors = Type.Array(Type.String());

export type VoteFunctionsSelectors = Record<string, string[]>;
export const VoteFunctionsSelectors = Type.Record(Type.String(), Type.Array(Type.String()));