"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotDelegatorContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_delegator_json_1 = __importDefault(require("./abi-delegator.json"));
class SnapshotDelegatorContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_delegator_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ClearDelegate', 'SetDelegate'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.SnapshotDelegatorContract = SnapshotDelegatorContract;
//# sourceMappingURL=contract.js.map