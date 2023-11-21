"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AaveGovernanceV2Adapter = void 0;
const ethers_1 = require("ethers");
const contract_v2_1 = require("./contract-v2");
const transforms_1 = require("./transforms");
const abi_v2_json_1 = __importDefault(require("./abi-v2.json"));
const abi_aave_json_1 = __importDefault(require("./abi-aave.json"));
const abi_strategy_json_1 = __importDefault(require("./abi-strategy.json"));
const abi_executor_json_1 = __importDefault(require("./abi-executor.json"));
const ethers_multicall_1 = require("ethers-multicall");
const utils_1 = require("ethers/lib/utils");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for Compound Alpha Governor
 */
class AaveGovernanceV2Adapter {
    constructor(config) {
        var _a;
        this.contracts = config.contracts;
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
        return this.contracts.token;
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.contracts.governance}`,
        };
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_v2_json_1.default, ['create']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['submitVote', 'submitVoteBySignature'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_v2_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_aave_json_1.default, ['delegate']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getProposalCreationContractAddress() {
        return this.contracts.governance;
    }
    async getDelegationContractAddress() {
        return this.contracts.token;
    }
    async getVotingContractAddress() {
        return this.contracts.governance;
    }
    async getFramework() {
        return 'aave';
    }
    /**
     * Cannot paginate aave proposals
     */
    async getProposals(pagination = {}) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.contracts.token, abi_aave_json_1.default, rpc);
        const totalSupply = parseInt(ethers_1.ethers.utils.formatUnits(await contract.totalSupply(), 18));
        const governor = new contract_v2_1.AaveGovernanceV2Contract(this.contracts.governance, this.transports);
        const results = await governor.getAllProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        // resolve the content from IPFS -- while the promises are created all at
        // once, actual request parallelism will be determined by the http transport
        // configuration so this is not as gnarly as it looks
        const content = new Map();
        await Promise.all(results.items.map(async (item) => {
            const { ipfsHash } = item.parsed.args;
            const file = await governor.getProposalContent(ipfsHash);
            content.set(ipfsHash, file);
        }));
        // reduce the results
        const proposals = [];
        for (const item of results.items) {
            const ipfsContent = content.get(item.parsed.args.ipfsHash);
            if (!ipfsContent)
                throw new Error('unresolved ipfs content');
            const contract = new ethers_1.Contract(item.parsed.args.executor, abi_executor_json_1.default, rpc);
            const minQuorumBps = parseInt(ethers_1.ethers.utils.formatUnits(await contract.MINIMUM_QUORUM(), 1));
            // The executor reports the percent of the total supply that is needed for quorum
            // It is reported in bps so we have to calculate the percent of the supply here
            const quorum = totalSupply * 0.001 * minQuorumBps;
            const proposal = (0, transforms_1.mapProposal)(item.parsed, ipfsContent, quorum, item.event.transactionHash);
            proposals.push(proposal);
        }
        return { items: proposals, nextCursor: results.nextCursor };
    }
    async getProposalEvents(pagination = {}) {
        const governor = new contract_v2_1.AaveGovernanceV2Contract(this.contracts.governance, this.transports);
        const results = await governor.getAllProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = (0, transforms_1.mapProposalEvents)(results.items);
        return { items: events, nextCursor: results.nextCursor };
    }
    /**
     * We can paginate vote events but we cant filter by proposal
     */
    async getVotes(pagination = {}) {
        const governor = new contract_v2_1.AaveGovernanceV2Contract(this.contracts.governance, this.transports);
        const results = await governor.getAllVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getEncodedCastVoteData({ proposalId, choice }) {
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.contracts.governance;
        const contract = new ethers_1.Contract(this.contracts.governance, abi_v2_json_1.default, rpc);
        const functionSignature = contract.interface.getSighash('submitVote');
        const encodedData = contract.interface.encodeFunctionData(functionSignature, [proposalId, choice]);
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.contracts.governance, abi_v2_json_1.default, signer);
        if (choice !== 0 && choice !== 1) {
            throw new Error('choice parameter must be 0 or 1');
        }
        const res = await contract.submitVote(parseInt(proposalId, 10), choice !== 0);
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteAave',
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
        const contract = new ethers_1.Contract(this.contracts.token, abi_aave_json_1.default, signer);
        const res = await contract.delegate(delegatee);
        try {
            const result = await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateAave',
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
        const tokenContract = new contract_v2_1.AaveGovernanceV2Contract(this.contracts.token, this.transports);
        const tokenResults = await tokenContract.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const tokenEvents = tokenResults.items.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        return { items: tokenEvents, nextCursor: tokenResults.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.contracts.token, abi_aave_json_1.default, rpc);
        return await contract.getDelegateeByType(address, 0);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.contracts.token, abi_aave_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.getDelegateeByType(address, 0));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        const contract = new ethers_multicall_1.Contract(this.contracts.strategy, abi_strategy_json_1.default);
        let block = blockHeight;
        if (block === undefined) {
            block = await rpc.getBlockNumber();
        }
        const calls = addresses.map((a) => contract.getVotingPowerAt(a, block));
        const powers = await provider.all(calls);
        const info = powers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: parseFloat((0, utils_1.formatUnits)(power, 18)) };
        });
        return info;
    }
    async getBalance(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.contracts.token, abi_aave_json_1.default, rpc);
        const calls = addresses.map((a) => contract.balanceOf(a));
        const balances = await Promise.all(calls);
        return balances.map((balance, idx) => {
            return { address: addresses[idx], balance: parseFloat((0, utils_1.formatUnits)(balance, 18)) };
        });
    }
    async getTransferEvents(pagination = {}) {
        const governor = new contract_v2_1.AaveGovernanceV2Contract(this.contracts.token, this.transports);
        const results = await governor.getTransferEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((log) => {
            return {
                from: log.parsed.args.from,
                to: log.parsed.args.to,
                value: (0, utils_1.formatUnits)(log.parsed.args.value, 18),
                txHash: log.event.transactionHash,
            };
        });
        return { items: events, nextCursor: results.nextCursor };
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
exports.AaveGovernanceV2Adapter = AaveGovernanceV2Adapter;
//# sourceMappingURL=adapter.js.map