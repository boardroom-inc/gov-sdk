"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundGovernorBravoContract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_bravo_json_1 = __importDefault(require("./abi-bravo.json"));
const abi_comp_json_1 = __importDefault(require("./abi-comp.json"));
const abi_token_721_json_1 = __importDefault(require("./abi-token-721.json"));
/**
 * Basic gov bravo interactions
 */
class CompoundGovernorBravoContract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Fetch all proposal-related events from the governance contract
     */
    async getProposalCreatedEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_bravo_json_1.default, rpc);
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
        const contract = new ethers_1.Contract(this.address, abi_bravo_json_1.default, rpc);
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
        /*
          We use the tokenAbi for both erc20 and erc721 tokens because the token271 abi
          is the same for these events
        */
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
        const contract = new ethers_1.Contract(this.address, abi_bravo_json_1.default, rpc);
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
    async getTransferEvents(chainId, cursor, startBlock, endBlock, isTokenERC721) {
        const rpc = this.transports('rpc').network(chainId);
        let contract = new ethers_1.Contract(this.address, abi_comp_json_1.default, rpc);
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
    /**
     * Get quorum
     */
    async getQuorum(chainId) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_bravo_json_1.default, rpc);
        const quorumResult = await contract.quorumVotes();
        const quorum = parseInt(ethers_1.ethers.utils.formatUnits(quorumResult, 18));
        return quorum;
    }
}
exports.CompoundGovernorBravoContract = CompoundGovernorBravoContract;
//# sourceMappingURL=contract-bravo.js.map