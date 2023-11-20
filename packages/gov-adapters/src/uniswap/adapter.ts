import { Currency, Network, TokenAdapter, TokenInfo } from '@boardroom/gov-lib';
import { ChainId, Fetcher, Route, Token, WETH } from '@uniswap/sdk';

/**
 * A token adapter that will use the uniswap SDK to resolve the market price of
 * a token
 */
export class UniswapV2Adapter implements TokenAdapter {
  constructor(private address: string, private symbol: string, private decimals = 18) {}

  async getInfo(currency: Currency = 'usd', network: Network = 'ethereum'): Promise<TokenInfo> {
    if (currency !== 'usd') {
      throw new Error(`unsupported currency: ${currency}`);
    }
    if (network !== 'ethereum') {
      throw new Error('unsupported network');
    }

    // create a uniswap market route from token -> WETH -> DAI to determine the
    // market rate of the token
    const token = new Token(ChainId.MAINNET, this.address, this.decimals);
    const tokenWETHPair = await Fetcher.fetchPairData(token, WETH[ChainId.MAINNET]);
    const DAI = new Token(ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18);
    const WETHDAIPair = await Fetcher.fetchPairData(WETH[ChainId.MAINNET], DAI);
    const route = new Route([WETHDAIPair, tokenWETHPair], DAI);
    const price = Number(route.midPrice.invert().toSignificant(6));

    return {
      symbol: this.symbol,
      contractAddress: { address: this.address, network: 'ethereum' },
      currentMarketPrice: { currency: 'usd', amount: price },
    };
  }
}
