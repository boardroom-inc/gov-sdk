"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CouncilAdapter = exports.vestingVaultABI = exports.lockingVaultABI = void 0;
const ethers_1 = require("ethers");
const gov_lib_1 = require("@boardroom/gov-lib");
const coreContract_1 = require("./coreContract");
const vaultContract_1 = require("./vaultContract");
const transforms_1 = require("./transforms");
const utils_1 = require("ethers/lib/utils");
const abi_LockingVault_json_1 = __importDefault(require("./abi-LockingVault.json"));
const abi_VestingVault_json_1 = __importDefault(require("./abi-VestingVault.json"));
const abi_coreVoting_json_1 = __importDefault(require("./abi-coreVoting.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const utils_2 = require("./../utils");
exports.lockingVaultABI = abi_LockingVault_json_1.default;
exports.vestingVaultABI = abi_VestingVault_json_1.default;
class CouncilAdapter {
    constructor(config) {
        var _a;
        this.coreVotingAddress = config.coreVotingAddress;
        this.tokenAddress = config.tokenAddress;
        this.transports = config.transports;
        this.protocolName = config.protocolName;
        this.votingVaults = config.votingVaults;
        this.proposalsOffChainDataURL = config.proposalsOffChainDataURL;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.boardroomAPIKey = config.boardroomAPIKey;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getSnapshotSpaceName() {
        return '';
    }
    async getExternalLink() {
        return {
            name: 'Etherscan.io',
            url: `https://etherscan.io/address/${this.coreVotingAddress}`,
        };
    }
    async getFramework() {
        return 'council';
    }
    async getTokenAddress() {
        return this.tokenAddress;
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_coreVoting_json_1.default, ['proposal']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['vote'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_coreVoting_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_LockingVault_json_1.default, ['changeDelegation', 'deposit']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getProposalCreationContractAddress() {
        return this.coreVotingAddress;
    }
    async getDelegationContractAddress() {
        return this.votingVaults[0].address;
    }
    async getVotingContractAddress() {
        return this.coreVotingAddress;
    }
    async getProposalsOffChainData() {
        const resp = await this.transports('http').fetch(this.proposalsOffChainDataURL);
        const text = await resp.text();
        // Remove the import statement and export declarations
        let content = text.replace(/import { CouncilConfig } from "src\/config\/CouncilConfig";/, '');
        content = content.replace(/export const mainnetCouncilConfig: CouncilConfig = /, '');
        //delete comments
        content = content.replace(/\/\*\*[\s\S]*?\*\//g, '');
        //enclose keys in double quotes
        content = content.replace(/([{,]\s*)([a-zA-Z_][a-zA-Z0-9_]*|\d+)\s*:/g, '$1"$2":');
        //remove trailing commas
        content = content.replace(/,(?=\s*?[\]}])/g, '');
        //remove semicolon
        content = content.replace(';', '');
        const json = JSON.parse(content);
        const proposalsData = json.coreVoting.proposals;
        const proposalIds = Object.keys(proposalsData);
        const mappedProposals = [];
        proposalIds.forEach((proposalId) => {
            const proposalData = proposalsData[proposalId];
            mappedProposals.push({
                title: proposalData.title,
                description: proposalData.paragraphSummary,
                proposalId: proposalId,
                calldatas: proposalData.calldatas,
                targets: proposalData.targets,
            });
        });
        return mappedProposals;
    }
    async getProposals(pagination = {}) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const coreVoting = new coreContract_1.CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
        const results = await coreVoting.getProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const proposalsOffChainData = await this.getProposalsOffChainData();
        const contract = new ethers_1.Contract(this.coreVotingAddress, abi_coreVoting_json_1.default, rpc);
        const baseQuorum = parseInt(ethers_1.ethers.utils.formatUnits(await contract.baseQuorum(), 18));
        const proposals = results.items.map((item) => (0, transforms_1.mapProposal)(item.parsed, ['YES', 'NO', 'MAYBE'], proposalsOffChainData, baseQuorum, item.event.transactionHash));
        return { items: proposals, nextCursor: results.nextCursor };
    }
    async getProposalEvents(pagination = {}) {
        const coreVoting = new coreContract_1.CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
        const results = await coreVoting.getProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapProposalEvent)(i));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const block = blockHeight || (await rpc.getBlockNumber());
        let totalVotePowers = new Array(addresses.length).fill(0);
        for (const votingVault of this.votingVaults) {
            const contract = new ethers_1.Contract(votingVault.address, votingVault.abi, rpc);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const calls = addresses.map((address) => {
                return this.vaultQueryVotePower(contract, address, block);
            });
            const powers = await Promise.all(calls);
            totalVotePowers = totalVotePowers.map((power, i) => power + powers[i]);
        }
        const info = totalVotePowers.map((power, idx) => {
            return { protocol: this.protocolName, address: addresses[idx], power: power };
        });
        return info;
    }
    // Vault contracts throw an error when the voting power is 0.
    // This function catches that case and returns 0 instead
    async vaultQueryVotePower(contract, address, block) {
        try {
            const votingPower = await contract.queryVotePowerView(address, block);
            return parseFloat((0, utils_1.formatUnits)(votingPower));
        }
        catch {
            return 0;
        }
    }
    async getVotes(pagination = {}) {
        const coreVoting = new coreContract_1.CouncilCoreVotingContract(this.coreVotingAddress, this.transports);
        const results = await coreVoting.getVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getDelegationEvents(pagination = {}) {
        const chainId = await this.getChainId();
        const vaultResultsItems = [];
        const vaultResultsCursors = [];
        for (const votingVault of this.votingVaults) {
            const contract = new vaultContract_1.VaultContract(votingVault.address, this.transports);
            const vaultResult = await contract.getDelegationEvents(chainId, votingVault.abi, pagination.cursor, pagination.startBlock, pagination.endBlock);
            vaultResultsItems.push(...vaultResult.items);
            if (vaultResult.nextCursor) {
                vaultResultsCursors.push(vaultResult.nextCursor);
            }
        }
        vaultResultsItems.sort((a, b) => {
            return a.event.blockNumber - b.event.blockNumber || a.event.logIndex - b.event.logIndex;
        });
        const events = vaultResultsItems.map((i) => (0, transforms_1.mapDelegationEvents)(i));
        const nextCursor = vaultResultsCursors.length ? this.getLatestCursor(vaultResultsCursors) : undefined;
        return { items: events, nextCursor: nextCursor };
    }
    getLatestCursor(cursors) {
        const decodedCursors = cursors.map((cursor) => (0, gov_lib_1.decodeCursor)(cursor));
        //sort cursors first by block, and then by log -- ascending order
        decodedCursors.sort((a, b) => {
            return a.block - b.block || a.log - b.log;
        });
        const decodedLatestCursor = decodedCursors[decodedCursors.length - 1];
        return (0, gov_lib_1.encodeCursor)(decodedLatestCursor);
    }
    async getDelegation(address) {
        // Since one address can delegate to multiple addresses this method signature doesn't work.
        throw new Error('getDelegation is not supported for the Council framework. Use getDelegations method instead.');
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const delegations = [];
        for (const votingVault of this.votingVaults) {
            const abi = votingVault.abi;
            const vaultDelegations = await votingVault.getDelegations(addresses, abi, votingVault.address, rpc);
            delegations.push(...vaultDelegations);
        }
        return delegations;
    }
    // Currently only works on the LockingVault, as that is the most used one (by a 10x factor).
    // Adding new vaults would require changes on the frontend.
    async delegateVotingPower(delegatee, identifier) {
        const signer = this.transports('signer').signer;
        const signerAddress = await signer.getAddress();
        const lockingVaultContract = new ethers_1.Contract(this.votingVaults[0].address, abi_LockingVault_json_1.default, signer);
        const currentDelegate = await lockingVaultContract.deposits(signerAddress)[0]; //get 'who' attribute
        const signerHasDelegatedBefore = currentDelegate != ethers_1.constants.AddressZero;
        let res;
        if (signerHasDelegatedBefore) {
            res = await lockingVaultContract.changeDelegation(delegatee);
        }
        else {
            const tokenContract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, signer);
            //all the signer's tokens will be delegated
            const amount = await tokenContract.balanceOf(signerAddress);
            const formattedAmount = ethers_1.BigNumber.from(amount).toString();
            await tokenContract.approve(signerAddress);
            res = await lockingVaultContract.deposit(signerAddress, formattedAmount, delegatee);
        }
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateCouncil',
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
    async getEncodedCastVoteData({ proposalId, choice }) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceAddress = this.coreVotingAddress;
        const contract = new ethers_1.Contract(governanceAddress, abi_coreVoting_json_1.default, rpc);
        const functionSignature = contract.interface.getSighash('vote');
        const votingVaultsAddresses = this.votingVaults.map((votingVault) => {
            return votingVault.address;
        });
        const encodedData = contract.interface.encodeFunctionData(functionSignature, [
            votingVaultsAddresses,
            [],
            parseInt(proposalId, 10),
            choice,
        ]);
        return {
            encodedData,
            toContractAddress: governanceAddress,
        };
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.coreVotingAddress, abi_coreVoting_json_1.default, signer);
        const votingVaultsAddresses = this.votingVaults.map((votingVault) => {
            return votingVault.address;
        });
        const res = await contract.vote(votingVaultsAddresses, [], parseInt(proposalId, 10), choice);
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteCouncil',
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
    async getBalance(addresses, blockHeight) {
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
exports.CouncilAdapter = CouncilAdapter;
//# sourceMappingURL=adapter.js.map