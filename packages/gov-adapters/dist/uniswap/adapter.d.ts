import { Currency, Network, TokenAdapter, TokenInfo } from '@boardroom/gov-lib';
/**
 * A token adapter that will use the uniswap SDK to resolve the market price of
 * a token
 */
export declare class UniswapV2Adapter implements TokenAdapter {
    private address;
    private symbol;
    private decimals;
    constructor(address: string, symbol: string, decimals?: number);
    getInfo(currency?: Currency, network?: Network): Promise<TokenInfo>;
}
