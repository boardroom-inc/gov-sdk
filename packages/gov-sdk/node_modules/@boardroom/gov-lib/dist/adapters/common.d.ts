import { Static } from '@sinclair/typebox';
/**
 * External link / URL
 */
export declare type ExternalLink = Static<typeof ExternalLink>;
export declare const ExternalLink: import("@sinclair/typebox").TObject<{
    url: import("@sinclair/typebox").TString;
    name: import("@sinclair/typebox").TString;
}>;
/**
 * ChainId to use for actions
 */
export declare type ChainId = Static<typeof ChainId>;
export declare const ChainId: import("@sinclair/typebox").TNumber;
/**
 * Blockchain network
 */
export declare type Network = Static<typeof Network>;
export declare const Network: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ethereum">, import("@sinclair/typebox").TLiteral<"polygon-pos">, import("@sinclair/typebox").TLiteral<"binance-smart-chain">, import("@sinclair/typebox").TLiteral<"optimistic-ethereum">, import("@sinclair/typebox").TLiteral<"arbitrum-one">]>;
/**
 * Framework
 */
export declare type Framework = Static<typeof Framework>;
export declare const Framework: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"snapshot">, import("@sinclair/typebox").TLiteral<"aave">, import("@sinclair/typebox").TLiteral<"openZeppelin">, import("@sinclair/typebox").TLiteral<"compoundAlpha">, import("@sinclair/typebox").TLiteral<"compoundBravo">, import("@sinclair/typebox").TLiteral<"nouns">, import("@sinclair/typebox").TLiteral<"moloch">, import("@sinclair/typebox").TLiteral<"tornadoCash">, import("@sinclair/typebox").TLiteral<"makerDaoPolling">, import("@sinclair/typebox").TLiteral<"makerDaoExecutive">, import("@sinclair/typebox").TLiteral<"council">, import("@sinclair/typebox").TLiteral<"nounsBuilder">]>;
/**
 * Adapter instance type
 */
export declare type AdapterInstanceType = Static<typeof AdapterInstanceType>;
export declare const AdapterInstanceType: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"snapshot">, import("@sinclair/typebox").TLiteral<"onchain">, import("@sinclair/typebox").TLiteral<"onchain-secondary">, import("@sinclair/typebox").TLiteral<"onchain-optimism">, import("@sinclair/typebox").TLiteral<"onchain-arbitrum">, import("@sinclair/typebox").TLiteral<"archive">, import("@sinclair/typebox").TLiteral<"archiveAlpha">]>;
export declare type Address = Static<typeof Address>;
export declare const Address: import("@sinclair/typebox").TString;
export declare type Addresses = Static<typeof Addresses>;
export declare const Addresses: import("@sinclair/typebox").TObject<{
    addresses: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
}>;
/**
 * Smart contract address on the block chain
 */
export declare type ContractAddress = Static<typeof ContractAddress>;
export declare const ContractAddress: import("@sinclair/typebox").TObject<{
    network: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ethereum">, import("@sinclair/typebox").TLiteral<"polygon-pos">, import("@sinclair/typebox").TLiteral<"binance-smart-chain">, import("@sinclair/typebox").TLiteral<"optimistic-ethereum">, import("@sinclair/typebox").TLiteral<"arbitrum-one">]>;
    address: import("@sinclair/typebox").TString;
}>;
/**
 * Types of supported currencies
 */
export declare type Currency = Static<typeof Currency>;
export declare const Currency: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"usd">]>;
/**
 * An amount with a currency unit
 */
export declare type CurrencyAmount = Static<typeof CurrencyAmount>;
export declare const CurrencyAmount: import("@sinclair/typebox").TObject<{
    currency: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"usd">]>;
    amount: import("@sinclair/typebox").TNumber;
}>;
/**
 * A datetime can be expressed as either a unix timestamp or a blockchain block
 * number
 */
export declare type Time = Static<typeof Time>;
export declare const Time: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TObject<{
    timestamp: import("@sinclair/typebox").TInteger;
}>, import("@sinclair/typebox").TObject<{
    blockNumber: import("@sinclair/typebox").TInteger;
}>]>;
/**
 * Evaluate an expression comparing the numerical values of two Times.  Throws
 * if not of the same type
 */
export declare const compareTime: (a: Time, b: Time, compare: (a: number, b: number) => unknown) => boolean;
/**
 * Tokens balance info
 */
export declare type TokenBalancesInfo = Static<typeof TokenBalancesInfo>;
export declare const TokenBalancesInfo: import("@sinclair/typebox").TObject<{
    tokenBalance: import("@sinclair/typebox").TString;
    balance: import("@sinclair/typebox").TNumber;
    tokenContractAddress: import("@sinclair/typebox").TString;
    tokenDecimals: import("@sinclair/typebox").TNumber;
    tokenName: import("@sinclair/typebox").TString;
    tokenSymbol: import("@sinclair/typebox").TString;
    tokenLogoUrl: import("@sinclair/typebox").TString;
}>;
/**
 * Tokens balance info along with currency unit
 */
export declare type CurrencyTokenBalancesInfo = Static<typeof CurrencyTokenBalancesInfo>;
export declare const CurrencyTokenBalancesInfo: import("@sinclair/typebox").TObject<{
    currency: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"usd">]>;
    tokenBalances: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        tokenBalance: import("@sinclair/typebox").TString;
        balance: import("@sinclair/typebox").TNumber;
        tokenContractAddress: import("@sinclair/typebox").TString;
        tokenDecimals: import("@sinclair/typebox").TNumber;
        tokenName: import("@sinclair/typebox").TString;
        tokenSymbol: import("@sinclair/typebox").TString;
        tokenLogoUrl: import("@sinclair/typebox").TString;
    }>>;
}>;
/**
 * Transaction object
 */
export declare type Transaction = Static<typeof Transaction>;
export declare const Transaction: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TInteger;
    txnHash: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    fromAddress: import("@sinclair/typebox").TString;
    toAddress: import("@sinclair/typebox").TString;
    gasSpent: import("@sinclair/typebox").TInteger;
    blockHeight: import("@sinclair/typebox").TInteger;
}>;
export declare type Transactions = Array<Transaction>;
export declare const Transactions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TInteger;
    txnHash: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    fromAddress: import("@sinclair/typebox").TString;
    toAddress: import("@sinclair/typebox").TString;
    gasSpent: import("@sinclair/typebox").TInteger;
    blockHeight: import("@sinclair/typebox").TInteger;
}>>;
export declare type TransactionsResponse = Static<typeof TransactionsResponse>;
export declare const TransactionsResponse: import("@sinclair/typebox").TObject<{
    transactions: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        address: import("@sinclair/typebox").TString;
        chainId: import("@sinclair/typebox").TInteger;
        txnHash: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
        fromAddress: import("@sinclair/typebox").TString;
        toAddress: import("@sinclair/typebox").TString;
        gasSpent: import("@sinclair/typebox").TInteger;
        blockHeight: import("@sinclair/typebox").TInteger;
    }>>;
    pageNumber: import("@sinclair/typebox").TInteger;
    hasMorePages: import("@sinclair/typebox").TBoolean;
}>;
/**
 * Transfer object
 */
export declare type Transfer = Static<typeof Transfer>;
export declare const Transfer: import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TInteger;
    txnHash: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    gasSpent: import("@sinclair/typebox").TInteger;
    blockHeight: import("@sinclair/typebox").TInteger;
    transfer: import("@sinclair/typebox").TObject<{
        from_address: import("@sinclair/typebox").TString;
        to_address: import("@sinclair/typebox").TString;
        delta_quote: import("@sinclair/typebox").TString;
        transfer_type: import("@sinclair/typebox").TString;
        contract_ticker_symbol: import("@sinclair/typebox").TString;
        contract_address: import("@sinclair/typebox").TString;
    }>;
}>;
export declare type Transfers = Array<Transfer>;
export declare const Transfers: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
    address: import("@sinclair/typebox").TString;
    chainId: import("@sinclair/typebox").TInteger;
    txnHash: import("@sinclair/typebox").TString;
    value: import("@sinclair/typebox").TString;
    gasSpent: import("@sinclair/typebox").TInteger;
    blockHeight: import("@sinclair/typebox").TInteger;
    transfer: import("@sinclair/typebox").TObject<{
        from_address: import("@sinclair/typebox").TString;
        to_address: import("@sinclair/typebox").TString;
        delta_quote: import("@sinclair/typebox").TString;
        transfer_type: import("@sinclair/typebox").TString;
        contract_ticker_symbol: import("@sinclair/typebox").TString;
        contract_address: import("@sinclair/typebox").TString;
    }>;
}>>;
export declare type TransfersResponse = Static<typeof TransfersResponse>;
export declare const TransfersResponse: import("@sinclair/typebox").TObject<{
    transfers: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TObject<{
        address: import("@sinclair/typebox").TString;
        chainId: import("@sinclair/typebox").TInteger;
        txnHash: import("@sinclair/typebox").TString;
        value: import("@sinclair/typebox").TString;
        gasSpent: import("@sinclair/typebox").TInteger;
        blockHeight: import("@sinclair/typebox").TInteger;
        transfer: import("@sinclair/typebox").TObject<{
            from_address: import("@sinclair/typebox").TString;
            to_address: import("@sinclair/typebox").TString;
            delta_quote: import("@sinclair/typebox").TString;
            transfer_type: import("@sinclair/typebox").TString;
            contract_ticker_symbol: import("@sinclair/typebox").TString;
            contract_address: import("@sinclair/typebox").TString;
        }>;
    }>>;
    pageNumber: import("@sinclair/typebox").TInteger;
    hasMorePages: import("@sinclair/typebox").TBoolean;
}>;
export declare type FunctionsSelectors = string[];
export declare const FunctionsSelectors: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
export declare type VoteFunctionsSelectors = Record<string, string[]>;
export declare const VoteFunctionsSelectors: import("@sinclair/typebox").TRecord<import("@sinclair/typebox").TString, import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>>;
