import {
  Currency,
  Icon,
  IconAdapter,
  IconInfo,
  Network,
  TokenAdapter,
  TokenInfo,
  TransportResolver,
} from '@boardroom/gov-lib';
import { CoinGeckoDataSource } from './api';

export class CoinGeckoAdapter implements TokenAdapter, IconAdapter {
  private readonly coingecko: CoinGeckoDataSource;

  constructor(private readonly tokenId: string, transports: TransportResolver) {
    this.coingecko = new CoinGeckoDataSource(transports);
  }

  async getInfo(currency: Currency = 'usd', network?: Network): Promise<TokenInfo> {
    const info = await this.coingecko.getCoinInfo(this.tokenId);
    const { symbol, platforms, market_data } = info;
    // network defaults to first value in list if not provided as arg. the cast
    // is a lie but adapter response are validated at runtime
    network = network !== undefined ? network : (Object.keys(platforms)[0] as Network);
    const address = platforms[network];
    const amount = market_data.current_price[currency];
    return {
      symbol,
      contractAddress: { address, network },
      currentMarketPrice: { currency, amount },
      totalSupply: market_data.total_supply ? market_data.total_supply : undefined,
      maxSupply: market_data.max_supply ? market_data.max_supply : undefined,
      circulatingSupply: market_data.circulating_supply ? market_data.circulating_supply : undefined,
    };
  }

  async getIcons(): Promise<IconInfo> {
    const info = await this.coingecko.getCoinInfo(this.tokenId);

    const { image } = info;

    const icons = Object.entries(image).map<Icon>(([size, url]) => {
      return { size, url };
    });

    return { icons };
  }
}
