import { TransportResolver } from '@boardroom/gov-lib';

/*

  token info via the gek

  https://www.coingecko.com/api/documentations/v3#/coins/get_coins__id_

*/

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

export class CoinGeckoDataSource {
  constructor(private readonly transports: TransportResolver) {}

  async getCoinInfo(tokenId: string): Promise<CoinInfoResponse> {
    const url = `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
    const resp = await this.transports('http').getJson(url, 120); // caching for a while
    return resp.data;
  }
}
