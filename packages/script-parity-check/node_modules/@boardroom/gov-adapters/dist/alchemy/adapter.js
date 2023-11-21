"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlchemyAdapter = void 0;
class AlchemyAdapter {
    constructor(address, transports, chainId) {
        this.address = address;
        this.transports = transports;
        this.chainId = chainId;
    }
    async getIcons() {
        const { logo } = await this._getTokenMetadata();
        if (logo === null) {
            return { icons: [] };
        }
        return { icons: [{ size: 'default', url: logo }] };
    }
    async _getTokenMetadata() {
        const rpc = this.transports('rpc').network(this.chainId ? this.chainId : 1);
        return await rpc.send('alchemy_getTokenMetadata', [this.address]);
    }
}
exports.AlchemyAdapter = AlchemyAdapter;
//# sourceMappingURL=adapter.js.map