import { Static } from '@sinclair/typebox';
import { ResponseValidator } from '../validation';
import { Currency, Network } from './common';
/**
 * Basic information about a fungible token
 */
export declare type TokenInfo = Static<typeof TokenInfo>;
export declare const TokenInfo: import("@sinclair/typebox").TObject<{
    symbol: import("@sinclair/typebox").TString;
    contractAddress: import("@sinclair/typebox").TObject<{
        network: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"ethereum">, import("@sinclair/typebox").TLiteral<"polygon-pos">, import("@sinclair/typebox").TLiteral<"binance-smart-chain">, import("@sinclair/typebox").TLiteral<"optimistic-ethereum">, import("@sinclair/typebox").TLiteral<"arbitrum-one">]>;
        address: import("@sinclair/typebox").TString;
    }>;
    currentMarketPrice: import("@sinclair/typebox").TObject<{
        currency: import("@sinclair/typebox").TUnion<[import("@sinclair/typebox").TLiteral<"usd">]>;
        amount: import("@sinclair/typebox").TNumber;
    }>;
    circulatingSupply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    totalSupply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
    maxSupply: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TNumber>;
}>;
/**
 * Adapter that can surface token information
 */
export interface TokenAdapter {
    /**
     * Get information about a token. Network only required for multi-chain tokens
     */
    getInfo: (currency?: Currency, network?: Network) => Promise<TokenInfo>;
}
export declare const tokenAdapterValidators: ResponseValidator<TokenAdapter>;
