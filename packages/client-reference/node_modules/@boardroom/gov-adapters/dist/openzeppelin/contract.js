"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenZeppelinGovernanceContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
const abi_governor_voting_module_json_1 = __importDefault(require("./abi-governor-voting-module.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const abi_token_721_json_1 = __importDefault(require("./abi-token-721.json"));
class OpenZeppelinGovernanceContract {
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
            events: ['ProposalCreated'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Fetch all proposal created events from the governance contract
     */
    async getAllProposalCreatedWithVotingModuleEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_voting_module_json_1.default, rpc);
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
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCanceled', 'ProposalExecuted', 'ProposalCreated', 'ProposalQueued'],
        }, startBlock, endBlock);
        return response;
    }
    async getProposalEventsWithVotingModule(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_voting_module_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCreated'],
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
            events: ['VoteCast', 'VoteCastWithParams'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_token_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['DelegateChanged', 'DelegateVotesChanged'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all transfer events
     */
    async getTransferEvents(chainId, cursor, startBlock, endBlock, isTokenERC721) {
        const rpc = this.transports('rpc').network(chainId);
        let contract = new ethers_1.Contract(this.address, abi_token_json_1.default, rpc);
        if (isTokenERC721) {
            contract = new ethers_1.Contract(this.address, abi_token_721_json_1.default, rpc);
        }
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['Transfer'],
        }, startBlock, endBlock);
        return response;
    }
    async getProposalDeadline(chainId, proposalId) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_governor_json_1.default, rpc);
        const deadline = await contract.proposalDeadline(proposalId);
        return deadline;
    }
}
exports.OpenZeppelinGovernanceContract = OpenZeppelinGovernanceContract;
//# sourceMappingURL=contract.js.map