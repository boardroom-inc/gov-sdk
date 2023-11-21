"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundGovernorAlphaContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_alpha_json_1 = __importDefault(require("./abi-alpha.json"));
const abi_comp_json_1 = __importDefault(require("./abi-comp.json"));
/**
 * Basic gov alpha interactions
 */
class CompoundGovernorAlphaContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Fetch all proposal-related events from the governance contract
     */
    async getProposalCreatedEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_alpha_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCreated'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all proposal events
     */
    async getProposalEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_alpha_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCanceled', 'ProposalQueued', 'ProposalExecuted', 'ProposalCreated'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_comp_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['DelegateChanged', 'DelegateVotesChanged'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all votes cast for the entire contract
     */
    async getVoteEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_alpha_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['VoteCast'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all transfer events
     */
    async getTransferEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_comp_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['Transfer'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.CompoundGovernorAlphaContract = CompoundGovernorAlphaContract;
//# sourceMappingURL=contract-alpha.js.map