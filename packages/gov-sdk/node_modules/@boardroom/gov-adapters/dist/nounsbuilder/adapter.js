"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NounsBuilderAdapter = void 0;
const ethers_1 = require("ethers");
const contract_1 = require("./contract");
const transforms_1 = require("./transforms");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const ethers_multicall_1 = require("ethers-multicall");
const utils_1 = require("./../utils");
/**
 * Proposals adapter for Nouns Builder Governor
 */
class NounsBuilderAdapter {
    constructor(config) {
        var _a;
        this.governanceAddress = config.governanceAddress;
        this.tokenAddress = config.tokenAddress;
        this.transports = config.transports;
        this.protocolName = config.protocolName;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.boardroomAPIKey = config.boardroomAPIKey;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getSnapshotSpaceName() {
        return '';
    }
    async getTokenAddress() {
        return this.tokenAddress;
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_1.getFunctionsSignatures)(abi_governor_json_1.default, ['propose']);
        return (0, utils_1.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['castVote', 'castVoteWithReason', 'castVoteBySig'];
        return (0, utils_1.getFunctionsSelectorsWithInputs)(abi_governor_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_1.getFunctionsSignatures)(abi_token_json_1.default, ['delegate', 'delegateBySig']);
        return (0, utils_1.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getProposalCreationContractAddress() {
        return this.governanceAddress;
    }
    async getDelegationContractAddress() {
        return this.tokenAddress;
    }
    async getVotingContractAddress() {
        return this.governanceAddress;
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.governanceAddress}`,
        };
    }
    async getFramework() {
        return 'nounsBuilder';
    }
    async getProposals(pagination = {}) {
        const governor = new contract_1.NounsBuilderGovernorContract(this.governanceAddress, this.transports);
        const results = await governor.getProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const items = [];
        for (const item of results.items) {
            const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
            const quorumResult = await contract.quorum();
            const quorum = parseInt(ethers_1.ethers.utils.formatUnits(quorumResult, 0));
            const proposal = (0, transforms_1.mapProposal)(item.parsed, ['AGAINST', 'FOR', 'ABSTAIN'], item.event.blockNumber, quorum, item.event.transactionHash);
            items.push(proposal);
        }
        return { items, nextCursor: results.nextCursor };
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
    async getProposalIdFromEvent() {
        throw new Error('Function not defined for this adapter');
    }
    async getProposalEvents(pagination = {}) {
        const governor = new contract_1.NounsBuilderGovernorContract(this.governanceAddress, this.transports);
        const results = await governor.getProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapProposalEvent)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getVotes(pagination = {}) {
        const governor = new contract_1.NounsBuilderGovernorContract(this.governanceAddress, this.transports);
        const results = await governor.getVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
    async getEncodedCastVoteData({ proposalId, choice, reason }) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.governanceAddress;
        const contract = new ethers_1.Contract(governanceAddress, abi_governor_json_1.default, rpc);
        let encodedData;
        if (reason) {
            const functionSignature = contract.interface.getSighash('castVoteWithReason');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice, reason]);
        }
        else {
            const functionSignature = contract.interface.getSighash('castVote');
            encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
        }
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter, reason } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        let res;
        if (reason) {
            res = await contract.castVoteWithReason(proposalId, choice, reason);
        }
        else {
            res = await contract.castVote(proposalId, choice);
        }
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteNounsBuilder',
                    hashId: res.hash,
                    proposalId: proposalId,
                    userAddress: await signer.getAddress(),
                    identifier,
                }),
                this.transports('http').postJson(`https://api.boardroom.info/v1/voters/addOrUpdatePendingVote?key=${this.boardroomAPIKey}`, {
                    cname: this.protocolName,
                    choices: choice,
                    address: await signer.getAddress(),
                    txnHash: res.hash,
                    status: 'pending',
                    power,
                    proposalRefId,
                    adapter: adapter || 'onchain',
                }),
            ]);
            await apiCalls;
        }
        catch (err) {
            console.log(err);
        }
        return res.hash;
    }
    async delegateVotingPower(delegatee) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, signer);
        const res = await contract.delegate(delegatee);
        try {
            const result = await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateNounsBuilder',
                hashId: res.hash,
                proposalId: '',
                userAddress: await signer.getAddress(),
            });
        }
        catch (err) {
            console.log(err);
        }
        return res.hash;
    }
    async getDelegationEvents(pagination = {}) {
        const governor = new contract_1.NounsBuilderGovernorContract(this.tokenAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, rpc);
        return await contract.delegates(address);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.delegates(address));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        const contract = new ethers_multicall_1.Contract(this.tokenAddress, abi_token_json_1.default);
        // any[] is the type that comes back from the ethers contract
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let calls;
        if (blockHeight === undefined) {
            calls = addresses.map((address) => contract.getVotes(address));
        }
        else {
            const { timestamp } = await rpc.getBlock(blockHeight);
            calls = addresses.map((address) => contract.getPastVotes(address, timestamp));
        }
        const powers = await provider.all(calls);
        const info = powers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseInt(power) };
        });
        return info;
    }
    async getBalance(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, rpc);
        const calls = addresses.map((a) => contract.balanceOf(a));
        const balances = await Promise.all(calls);
        return balances.map((balance, idx) => {
            return { address: addresses[idx], balance: parseInt(balance) };
        });
    }
    async getTransferEvents(pagination = {}) {
        const governor = new contract_1.NounsBuilderGovernorContract(this.tokenAddress, this.transports);
        const results = await governor.getTransferEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((log) => {
            return {
                from: log.parsed.args.from,
                to: log.parsed.args.to,
                value: '1',
                txHash: log.event.transactionHash,
            };
        });
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
}
exports.NounsBuilderAdapter = NounsBuilderAdapter;
//# sourceMappingURL=adapter.js.map