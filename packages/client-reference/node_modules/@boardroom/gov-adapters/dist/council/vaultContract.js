"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VaultContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
class VaultContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, vaultAbi, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, vaultAbi, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['VoteChange'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.VaultContract = VaultContract;
//# sourceMappingURL=vaultContract.js.map