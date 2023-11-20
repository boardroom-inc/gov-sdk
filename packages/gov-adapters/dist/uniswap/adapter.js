"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniswapV2Adapter = void 0;
const sdk_1 = require("@uniswap/sdk");
/**
 * A token adapter that will use the uniswap SDK to resolve the market price of
 * a token
 */
class UniswapV2Adapter {
    constructor(address, symbol, decimals = 18) {
        this.address = address;
        this.symbol = symbol;
        this.decimals = decimals;
    }
    async getInfo(currency = 'usd', network = 'ethereum') {
        if (currency !== 'usd') {
            throw new Error(`unsupported currency: ${currency}`);
        }
        if (network !== 'ethereum') {
            throw new Error('unsupported network');
        }
        // create a uniswap market route from token -> WETH -> DAI to determine the
        // market rate of the token
        const token = new sdk_1.Token(sdk_1.ChainId.MAINNET, this.address, this.decimals);
        const tokenWETHPair = await sdk_1.Fetcher.fetchPairData(token, sdk_1.WETH[sdk_1.ChainId.MAINNET]);
        const DAI = new sdk_1.Token(sdk_1.ChainId.MAINNET, '0x6B175474E89094C44Da98b954EedeAC495271d0F', 18);
        const WETHDAIPair = await sdk_1.Fetcher.fetchPairData(sdk_1.WETH[sdk_1.ChainId.MAINNET], DAI);
        const route = new sdk_1.Route([WETHDAIPair, tokenWETHPair], DAI);
        const price = Number(route.midPrice.invert().toSignificant(6));
        return {
            symbol: this.symbol,
            contractAddress: { address: this.address, network: 'ethereum' },
            currentMarketPrice: { currency: 'usd', amount: price },
        };
    }
}
exports.UniswapV2Adapter = UniswapV2Adapter;
//# sourceMappingURL=adapter.js.map