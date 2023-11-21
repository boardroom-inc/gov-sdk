"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouncilCoreVotingContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_coreVoting_json_1 = __importDefault(require("./abi-coreVoting.json"));
class CouncilCoreVotingContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    async getProposalCreatedEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_coreVoting_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCreated'],
        }, startBlock, endBlock);
        return response;
    }
    async getProposalEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_coreVoting_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalExecuted'],
        }, startBlock, endBlock);
        return response;
    }
    async getVoteEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_coreVoting_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['Voted'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.CouncilCoreVotingContract = CouncilCoreVotingContract;
//# sourceMappingURL=coreContract.js.map