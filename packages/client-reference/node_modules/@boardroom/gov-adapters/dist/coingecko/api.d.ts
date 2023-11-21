import { TransportResolver } from '@boardroom/gov-lib';
interface CoinInfoResponse {
    symbol: string;
    platforms: Record<string, string>;
    market_data: {
        current_price: Record<string, number>;
        total_supply: number;
        circulating_supply: number;
        max_supply: number;
    };
    image: {
        thumb: string;
        small: string;
        large: string;
    };
}
export declare class CoinGeckoDataSource {
    private readonly transports;
    constructor(transports: TransportResolver);
    getCoinInfo(tokenId: string): Promise<CoinInfoResponse>;
}
export {};
