"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveGovernanceV2Contract = void 0;
const ethers_1 = require("ethers");
const rpc_1 = require("../rpc");
const abi_v2_json_1 = __importDefault(require("./abi-v2.json"));
const abi_aave_json_1 = __importDefault(require("./abi-aave.json"));
class AaveGovernanceV2Contract {
    constructor(address, transports) {
        this.address = address;
        this.transports = transports;
    }
    /**
     * Resolve the proposal content from IPFS
     */
    async getProposalContent(ipfsHash) {
        const ipfs = this.transports('ipfs');
        // aave contracts store ipfs hash as a 32 byte word, this coverts it to the
        // standard base58 IPFS CID that is used to request the file from gateways
        // https://github.com/aave/governance-v2-subgraph/blob/master/src/mapping/governance.ts#L42
        const ipfsCid = ethers_1.utils.base58.encode('0x1220' + ipfsHash.slice(2));
        let content = {};
        try {
            content = (await ipfs.fetchJson(ipfsCid));
        }
        catch (e) {
            console.log(e);
            const resp = await ipfs.fetchRaw(ipfsCid);
            // Try to extract a title
            const title = resp.split('title:')[1];
            content.title = title.split('\n')[0];
            content.description = resp;
        }
        return content;
    }
    /**
     * Fetch all proposal created events from the governance contract
     */
    async getAllProposalCreatedEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_v2_json_1.default, rpc);
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
    async getAllProposalEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_v2_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['ProposalCanceled', 'ProposalExecuted', 'ProposalQueued', 'ProposalCreated'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Fetch all vote events from governance contract
     */
    async getAllVoteEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_v2_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['VoteEmitted'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all delegation events
     */
    async getDelegationEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_aave_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['DelegateChanged', 'DelegatedPowerChanged'],
        }, startBlock, endBlock);
        return response;
    }
    /**
     * Get all transfer events
     */
    async getTransferEvents(chainId, cursor, startBlock, endBlock) {
        const rpc = this.transports('rpc').network(chainId);
        const contract = new ethers_1.Contract(this.address, abi_aave_json_1.default, rpc);
        const response = await (0, rpc_1.queryEventLogs)({
            rpc,
            cursor,
            contract,
            events: ['Transfer'],
        }, startBlock, endBlock);
        return response;
    }
}
exports.AaveGovernanceV2Contract = AaveGovernanceV2Contract;
//# sourceMappingURL=contract-v2.js.map