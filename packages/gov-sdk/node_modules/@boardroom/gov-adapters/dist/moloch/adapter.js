"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MolochGovernorAdapter = void 0;
const ethers_1 = require("ethers");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
const utils_1 = require("ethers/lib/utils");
const contract_1 = require("./contract");
const transforms_1 = require("./transforms");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for Moloch Governor
 */
class MolochGovernorAdapter {
    constructor(config) {
        var _a;
        this.governanceAddress = config.governanceAddress;
        this.transports = config.transports;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.protocolName = config.protocolName;
        this.boardroomAPIKey = config.boardroomAPIKey;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getSnapshotSpaceName() {
        return '';
    }
    async getTokenAddress() {
        throw new Error('No token address for Moloch protocols');
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.governanceAddress}`,
        };
    }
    async getFramework() {
        return 'moloch';
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_governor_json_1.default, ['submitProposal']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['submitVote'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_governor_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_governor_json_1.default, ['updateDelegateKey']);
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
        const governor = new contract_1.MolochGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const iface = new utils_1.Interface(abi_governor_json_1.default);
        // Get the summoning time (time at which contract was deployed in unixtime seconds)
        const summoningTimeCallData = iface.encodeFunctionData('summoningTime');
        const summoningTimeCall = rpc.call({
            to: this.governanceAddress,
            data: summoningTimeCallData,
        });
        const summoningTimeResult = await Promise.all([summoningTimeCall]);
        const summoningTime = parseInt(summoningTimeResult[0], 16);
        // Get the period duration (length of 1 period in seconds)
        const periodDurationCallData = iface.encodeFunctionData('periodDuration');
        const periodDurationCall = rpc.call({
            to: this.governanceAddress,
            data: periodDurationCallData,
        });
        const periodDurationResult = await Promise.all([periodDurationCall]);
        const periodDuration = parseInt(periodDurationResult[0], 16);
        // Get the voting period length (number of periods a vote lasts)
        const votingPeriodLengthCallData = iface.encodeFunctionData('votingPeriodLength');
        const votingPeriodLengthCall = rpc.call({
            to: this.governanceAddress,
            data: votingPeriodLengthCallData,
        });
        const votingPeriodLengthResult = await Promise.all([votingPeriodLengthCall]);
        const votingPeriodLength = parseInt(votingPeriodLengthResult[0], 16);
        // Populate the starting periods for each proposal
        const startingPeriodMap = new Map();
        for (const item of results.items) {
            const proposalsCallData = iface.encodeFunctionData('proposals', [item.parsed.args.proposalId]);
            const proposalsCall = rpc.call({
                to: this.governanceAddress,
                data: proposalsCallData,
            });
            const proposalsResult = await Promise.all([proposalsCall]);
            startingPeriodMap.set(item.parsed.args.proposalId.toString(), proposalsResult[0]);
        }
        const proposals = results.items.map((item) => (0, transforms_1.mapProposal)(item.parsed, ['YES', 'NO'], item.event.blockNumber, summoningTime, periodDuration, votingPeriodLength, iface
            .decodeFunctionResult('proposals', startingPeriodMap.get(item.parsed.args.proposalId.toString()))['startingPeriod'].toString(), item.event.transactionHash));
        return { items: proposals, nextCursor: results.nextCursor };
    }
    async getProposalEvents(pagination = {}) {
        const governor = new contract_1.MolochGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapProposalEvents)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getVotes(pagination = {}) {
        const governor = new contract_1.MolochGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const iface = new utils_1.Interface(abi_governor_json_1.default);
        const calls = results.items.map((item) => {
            const blockHeight = item.event.blockNumber;
            const callData = iface.encodeFunctionData('members', [item.parsed.args.memberAddress]);
            return rpc.call({
                to: this.governanceAddress,
                data: callData,
            }, blockHeight);
        });
        const powers = await Promise.all(calls);
        const powerMap = powers.map((a) => parseInt(iface.decodeFunctionResult('members', a)['shares'], 10));
        const votes = (0, transforms_1.mapVotes)(results.items, powerMap);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getEncodedCastVoteData({ proposalId, choice }) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.governanceAddress;
        const contract = new ethers_1.Contract(governanceAddress, abi_governor_json_1.default, rpc);
        const functionSignature = contract.interface.getSighash('submitVote');
        const encodedData = contract.interface.encodeFunctionData(functionSignature, [parseInt(proposalId), choice]);
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        const res = await contract.submitVote(parseInt(proposalId), choice);
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteMoloch',
                    hashId: res.hash,
                    proposalId,
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
                    adapter: adapter || 'onchain',
                    proposalRefId,
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
        const res = await contract.updateDelegateKey(delegatee);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateMoloch',
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
        const governor = new contract_1.MolochGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        return await contract.memberAddressByDelegateKey(address);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.memberAddressByDelegateKey(address));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        if (blockHeight === undefined) {
            blockHeight = await rpc.getBlockNumber();
        }
        const iface = new utils_1.Interface(abi_governor_json_1.default);
        const calls = addresses.map((a) => {
            const callData = iface.encodeFunctionData('members', [a]);
            return rpc.call({
                to: this.governanceAddress,
                data: callData,
            }, blockHeight);
        });
        const powers = await Promise.all(calls);
        const info = powers.map((a, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseInt(iface.decodeFunctionResult('members', a)['shares'], 10) };
        });
        return info;
    }
    async getBalance(addresses, blockHeight) {
        return [];
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
    async getProposalIdFromEvent() {
        throw new Error("Function not defined for this adapter");
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error("Function not defined for this adapter");
    }
}
exports.MolochGovernorAdapter = MolochGovernorAdapter;
//# sourceMappingURL=adapter.js.map