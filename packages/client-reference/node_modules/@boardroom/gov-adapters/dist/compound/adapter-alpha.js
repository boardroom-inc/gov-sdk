"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompoundGovernorAlphaAdapter = void 0;
const ethers_1 = require("ethers");
const contract_alpha_1 = require("./contract-alpha");
const transforms_1 = require("./transforms");
const abi_alpha_json_1 = __importDefault(require("./abi-alpha.json"));
const abi_comp_json_1 = __importDefault(require("./abi-comp.json"));
const ethers_multicall_1 = require("ethers-multicall");
const utils_1 = require("ethers/lib/utils");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for Compound Alpha Governor
 */
class CompoundGovernorAlphaAdapter {
    constructor(config) {
        var _a;
        this.governanceAddress = config.governanceAddress;
        this.tokenAddress = config.tokenAddress;
        this.transports = config.transports;
        this.protocolName = config.protocolName;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.boardroomAPIKey = config.boardroomAPIKey;
        this.etherscanMainnetAPIKey = config.etherscanMainnetAPIKey;
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
        return 'compoundAlpha';
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_alpha_json_1.default, ['propose']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['castVote', 'castVoteBySig'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_alpha_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_comp_json_1.default, ['delegate']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
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
    async getProposals(pagination = {}) {
        const governor = new contract_alpha_1.CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
        const results = await governor.getProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const items = [];
        for (const item of results.items) {
            const contract = new ethers_1.Contract(this.governanceAddress, abi_alpha_json_1.default, rpc);
            const quorumResult = await contract.quorumVotes();
            const quorum = parseInt(ethers_1.ethers.utils.formatUnits(quorumResult, 18));
            const proposal = (0, transforms_1.mapProposal)(item.parsed, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, item.event.transactionHash);
            items.push(proposal);
        }
        return { items, nextCursor: results.nextCursor };
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
    async getProposalIdFromEvent() {
        throw new Error("Function not defined for this adapter");
    }
    async getProposalEvents(pagination = {}) {
        const governor = new contract_alpha_1.CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
        const results = await governor.getProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapProposalEvent)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getVotes(pagination = {}) {
        const governor = new contract_alpha_1.CompoundGovernorAlphaContract(this.governanceAddress, this.transports);
        const results = await governor.getVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
    async getEncodedCastVoteData({ proposalId, choice }) {
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.governanceAddress;
        const contract = new ethers_1.Contract(governanceAddress, abi_alpha_json_1.default, rpc);
        const functionSignature = contract.interface.getSighash('castVote');
        const encodedData = contract.interface.encodeFunctionData(functionSignature, [parseInt(proposalId, 10), choice]);
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_alpha_json_1.default, signer);
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const res = await contract.castVote(parseInt(proposalId, 10), choice !== 0);
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteCompoundAlpha',
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
        const contract = new ethers_1.Contract(this.tokenAddress, abi_comp_json_1.default, signer);
        const res = await contract.delegate(delegatee);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateCompoundAlpha',
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
        const governor = new contract_alpha_1.CompoundGovernorAlphaContract(this.tokenAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_comp_json_1.default, rpc);
        return await contract.delegates(address);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_comp_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.delegates(address));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getTransferEvents(pagination = {}) {
        const governor = new contract_alpha_1.CompoundGovernorAlphaContract(this.tokenAddress, this.transports);
        const results = await governor.getTransferEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((log) => {
            return {
                from: log.parsed.args.from,
                to: log.parsed.args.to,
                value: (0, utils_1.formatUnits)(log.parsed.args.amount, 18),
                txHash: log.event.transactionHash,
            };
        });
        return { items: events, nextCursor: results.nextCursor };
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        const contract = new ethers_multicall_1.Contract(this.tokenAddress, abi_comp_json_1.default);
        // any[] is the type that comes back from the ethers contract
        // metaprogramming abstraction
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let calls;
        if (blockHeight === undefined) {
            calls = addresses.map((a) => contract.getCurrentVotes(a));
        }
        else {
            calls = addresses.map((a) => contract.getPriorVotes(a, blockHeight));
        }
        const powers = await provider.all(calls);
        const info = powers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
        });
        return info;
    }
    async getBalance(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_comp_json_1.default, rpc);
        const calls = addresses.map((a) => contract.balanceOf(a));
        const balances = await Promise.all(calls);
        return balances.map((balance, idx) => {
            return { address: addresses[idx], balance: parseFloat((0, utils_1.formatUnits)(balance, 18)) };
        });
    }
    async getContract(contractAddress) {
        const resp = await this.transports('http').getJson(`https://api.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
            contractAddress);
        return JSON.parse(resp.data.result);
    }
    async getContractFunctions(contractAddress) {
        const abi = await this.getContract(contractAddress);
        const filteredAbi = abi.filter((obj) => {
            return obj.type === 'function';
        });
        return JSON.stringify(filteredAbi);
    }
    async encodeCalldata(data) {
        return utils_1.defaultAbiCoder.encode(data.types, data.values);
    }
    /**
     * @param targets The ordered list of target addresses for calls to be made
     * @param values The ordered list of values (i.e. msg.value) to be passed to the calls to be made
     * @param signatures The ordered list of function signatures to be called
     * @param calldatas The ordered list of calldata to be passed to each call
     * @param description The proposal description of intended actions
     */
    async createOnChainProposal(payload, identifier) {
        const signer = this.transports('signer').signer;
        const encodedCallData = [];
        let index = 0;
        for (const data of payload.calldata) {
            const target = payload.targets[index];
            const contractAbi = await this.getContract(target);
            let contractIface = new ethers_1.ethers.utils.Interface(contractAbi);
            const encodedFunctionData = contractIface.encodeFunctionData(data.type, data.values);
            encodedCallData.push(encodedFunctionData);
            index++;
        }
        const iface = new utils_1.Interface(abi_alpha_json_1.default);
        const encodedFunctionData = iface.encodeFunctionData('propose', [
            payload.targets,
            payload.values,
            payload.signatures,
            encodedCallData,
            payload.description,
        ]);
        const call = signer.sendTransaction({
            to: this.governanceAddress,
            data: encodedFunctionData,
        });
        const result = await Promise.all([call]);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'createOnChainProposalCompoundAlpha',
                // The response from onchain looks like [{"hash":"0x047a44d69fb0a04a6b4fadb82bfc057eb88ac23182b581e490f131035b37cead","type":null ...}]
                hashId: result[0].hash,
                userAddress: await signer.getAddress(),
                identifier,
                separateAction: 'createProposal',
                separateFramework: await this.getFramework(),
            });
        }
        catch (err) {
            console.log(err);
        }
        return JSON.stringify(result);
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
}
exports.CompoundGovernorAlphaAdapter = CompoundGovernorAlphaAdapter;
//# sourceMappingURL=adapter-alpha.js.map