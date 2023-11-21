"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoinGeckoDataSource = void 0;
class CoinGeckoDataSource {
    constructor(transports) {
        this.transports = transports;
    }
    async getCoinInfo(tokenId) {
        const url = `https://api.coingecko.com/api/v3/coins/${tokenId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`;
        const resp = await this.transports('http').getJson(url, 120); // caching for a while
        return resp.data;
    }
}
exports.CoinGeckoDataSource = CoinGeckoDataSource;
//# sourceMappingURL=api.js.map