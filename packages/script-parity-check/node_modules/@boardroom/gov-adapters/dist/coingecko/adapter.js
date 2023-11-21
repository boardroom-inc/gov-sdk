"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoAdapter = void 0;
const api_1 = require("./api");
class CoinGeckoAdapter {
    constructor(tokenId, transports) {
        this.tokenId = tokenId;
        this.coingecko = new api_1.CoinGeckoDataSource(transports);
    }
    async getInfo(currency = 'usd', network) {
        const info = await this.coingecko.getCoinInfo(this.tokenId);
        const { symbol, platforms, market_data } = info;
        // network defaults to first value in list if not provided as arg. the cast
        // is a lie but adapter response are validated at runtime
        network = network !== undefined ? network : Object.keys(platforms)[0];
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
    async getIcons() {
        const info = await this.coingecko.getCoinInfo(this.tokenId);
        const { image } = info;
        const icons = Object.entries(image).map(([size, url]) => {
            return { size, url };
        });
        return { icons };
    }
}
exports.CoinGeckoAdapter = CoinGeckoAdapter;
//# sourceMappingURL=adapter.js.map