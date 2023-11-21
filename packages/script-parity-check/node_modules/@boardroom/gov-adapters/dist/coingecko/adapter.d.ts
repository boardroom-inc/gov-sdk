import { Currency, IconAdapter, IconInfo, Network, TokenAdapter, TokenInfo, TransportResolver } from '@boardroom/gov-lib';
export declare class CoinGeckoAdapter implements TokenAdapter, IconAdapter {
    private readonly tokenId;
    private readonly coingecko;
    constructor(tokenId: string, transports: TransportResolver);
    getInfo(currency?: Currency, network?: Network): Promise<TokenInfo>;
    getIcons(): Promise<IconInfo>;
}
