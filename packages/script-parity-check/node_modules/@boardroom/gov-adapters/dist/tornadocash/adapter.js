"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TornadoCashGovernorAdapter = void 0;
const ethers_1 = require("ethers");
const contract_1 = require("./contract");
const transforms_1 = require("./transforms");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
const ethers_multicall_1 = require("ethers-multicall");
const utils_1 = require("ethers/lib/utils");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for Tornado Cash Governor
 */
class TornadoCashGovernorAdapter {
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
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.governanceAddress}`,
        };
    }
    async getFramework() {
        return 'tornadoCash';
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_governor_json_1.default, ['propose', 'proposeByDelegate']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['castVote', 'castDelegatedVote'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_governor_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_governor_json_1.default, ['delegate', 'undelegate']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getProposalCreationContractAddress() {
        return this.governanceAddress;
    }
    async getDelegationContractAddress() {
        return this.governanceAddress;
    }
    async getVotingContractAddress() {
        return this.governanceAddress;
    }
    async getProposals(pagination = {}) {
        const governor = new contract_1.TornadoCashGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const proposals = results.items.map((item) => (0, transforms_1.mapProposal)(item.parsed, ['AGAINST', 'FOR'], item.event.blockNumber, item.event.transactionHash));
        return { items: proposals, nextCursor: results.nextCursor };
    }
    async getProposalEvents(pagination = {}) {
        const proposals = await this.getProposals(pagination);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        const multiContract = new ethers_multicall_1.Contract(this.governanceAddress, abi_governor_json_1.default);
        const calls = proposals.items.map((p) => multiContract.state(p.id));
        const results = await provider.all(calls);
        const events = (0, transforms_1.mapProposalEvents)(results, proposals);
        return { items: events };
    }
    async getVotes(pagination = {}) {
        const governor = new contract_1.TornadoCashGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getEncodedCastVoteData({ proposalId, choice }) {
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.governanceAddress;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const functionSignature = contract.interface.getSighash('castVote');
        const encodedData = contract.interface.encodeFunctionData(functionSignature, [
            parseInt(proposalId, 10),
            choice !== 0,
        ]);
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, adapter, identifier } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const res = await contract.castVote(parseInt(proposalId, 10), choice !== 0);
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteTornadoCash',
                    hashId: res.hash,
                    proposalId: proposalId,
                    userAddress: await signer.getAddress(),
                    identifier,
                    separateAction: 'castVote',
                    separateFramework: await this.getFramework(),
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
    async delegateVotingPower(delegatee, identifier) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        const res = await contract.delegate(delegatee);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateTornadoCash',
                hashId: res.hash,
                proposalId: '',
                userAddress: await signer.getAddress(),
                identifier,
                separateAction: 'delegate',
                separateFramework: await this.getFramework(),
            });
        }
        catch (err) {
            console.log(err);
        }
        return res.hash;
    }
    async getDelegationEvents(pagination = {}) {
        const governor = new contract_1.TornadoCashGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        return await contract.delegatedTo(address);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.delegatedTo(address));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        const multiContract = new ethers_multicall_1.Contract(this.governanceAddress, abi_governor_json_1.default);
        let info;
        if (blockHeight === undefined) {
            const calls = addresses.map((a) => multiContract.lockedBalance(a));
            const powers = await provider.all(calls);
            info = powers.map((power, idx) => {
                return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
            });
        }
        else {
            const iface = new utils_1.Interface(abi_governor_json_1.default);
            const calls = addresses.map((a) => {
                const callData = iface.encodeFunctionData('lockedBalance', [a]);
                return rpc.call({
                    to: this.governanceAddress,
                    data: callData,
                }, blockHeight);
            });
            const powers = await Promise.all(calls);
            info = powers.map((power, idx) => {
                return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
            });
        }
        return info;
    }
    async getBalance(addresses) {
        return [];
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
    async getProposalIdFromEvent() {
        throw new Error('Function not defined for this adapter');
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
}
exports.TornadoCashGovernorAdapter = TornadoCashGovernorAdapter;
//# sourceMappingURL=adapter.js.map