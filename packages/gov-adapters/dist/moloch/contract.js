"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MolochGovernanceContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
class MolochGovernanceContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Fetch all proposal created events from the governance contract
     */
    async getAllProposalCreatedEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['SubmitProposal'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all proposal events
     */
    async getProposalEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['CancelProposal', 'ProcessProposal', 'SponsorProposal', 'SubmitProposal'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Fetch all vote events from governance contract
     */
    async getAllVoteEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['SubmitVote'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['UpdateDelegateKey'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.MolochGovernanceContract = MolochGovernanceContract;
//# sourceMappingURL=contract.js.map