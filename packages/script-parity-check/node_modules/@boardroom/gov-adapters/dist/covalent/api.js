"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CovalentDataSource = void 0;
/*

  treasuryinfo via https://www.covalenthq.com/

  https://www.covalenthq.com/docs/api/#get-/v1/{chain_id}/address/{address}/balances_v2/

*/
const PROTOCOL = 'https';
const DOMAIN = 'api.covalenthq.com';
const API_VERSION = 'v1';
const API_KEY = 'ckey_49da45d0a3234757a78e826b4c4';
const PAGE_SIZE = 1000;
class CovalentDataSource {
    constructor(transports) {
        this.transports = transports;
    }
    async getBalanceInfo(addressOrAddresses, chain_id) {
        const arrayOfAddresses = typeof addressOrAddresses === 'string' ? [addressOrAddresses] : addressOrAddresses;
        const balancesInfoArray = await Promise.all(arrayOfAddresses.map(async (address) => {
            const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${address}/balances_v2/?&key=${API_KEY}`;
            const resp = await this.transports('http').getJson(url, 120); // caching for a while
            return resp.data.data;
        }));
        return balancesInfoArray;
    }
    async getTransactions(addressOrAddresses, chain_id, pageNumber = 0) {
        const arrayOfAddresses = typeof addressOrAddresses === 'string' ? [addressOrAddresses] : addressOrAddresses;
        let hasMorePages = false;
        const transactionsArray = await Promise.all(arrayOfAddresses.map(async (address) => {
            const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${address}/transactions_v2/?&key=${API_KEY}&page-number=${pageNumber}&page-size=${PAGE_SIZE}&sort={block_signed_at:1}`;
            console.log("Getting transactions from: " + url);
            const resp = await this.transports('http').getJson(url, 120); // caching for a while
            // Certain addresses are not supported by covalent due to too much activity or being a gas address
            if (resp.response.status === 406 || resp.response.status === 501) {
                return [];
            }
            hasMorePages = !hasMorePages ? resp.data.data.pagination.has_more : hasMorePages;
            return resp.data.data;
        }));
        return {
            transactions: transactionsArray,
            hasMorePages,
            pageNumber,
        };
    }
    async getTransfers(treasuryAddress, tokenAddress, chain_id, pageNumber = 0) {
        const url = `${PROTOCOL}://${DOMAIN}/${API_VERSION}/${chain_id}/address/${treasuryAddress}/transfers_v2/?&key=${API_KEY}&page-number=${pageNumber}&contract-address=${tokenAddress}&page-size=${PAGE_SIZE}&sort={block_signed_at:1}`;
        console.log("Getting transfers from: " + url);
        const resp = await this.transports('http').getJson(url, 120); // caching for a while
        let transfers = {
            address: treasuryAddress,
            chain_id: chain_id,
            items: []
        };
        let hasMorePages = false;
        // Certain addresses are not supported by covalent due to too much activity or being a gas address
        if (resp.response.status !== 406 && resp.response.status !== 501) {
            transfers = resp.data.data;
            if (resp.data.data.pagination === null) {
                hasMorePages = resp.data.data.pagination.has_more ? true : false;
            }
        }
        return {
            response: transfers,
            hasMorePages,
            pageNumber,
        };
    }
}
exports.CovalentDataSource = CovalentDataSource;
//# sourceMappingURL=api.js.map