"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IpfsTransport = void 0;
/**
 * Fetch objects from IPFS via an HTTP gateway
 */
class IpfsTransport {
    constructor(http, gateway = `https://gateway.pinata.cloud/ipfs/`) {
        this.http = http;
        this.gateway = gateway;
    }
    /**
     * Fetch an object from IPFS
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchJson(ipfsHash) {
        const url = `${this.gateway}${ipfsHash}`;
        // cache IPFS requests for a long time
        const { data } = await this.http.getJson(url, 60 * 60 * 24);
        return data;
    }
    /**
     * Fetch raw data from IPFS
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async fetchRaw(ipfsHash) {
        const url = `${this.gateway}${ipfsHash}`;
        const data = await (await this.http.fetch(url)).text();
        return data;
    }
}
exports.IpfsTransport = IpfsTransport;
//# sourceMappingURL=ipfs.js.map