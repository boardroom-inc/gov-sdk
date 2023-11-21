"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenZeppelinGovernorAdapter = void 0;
const ethers_1 = require("ethers");
const transforms_1 = require("./transforms");
const abi_governor_json_1 = __importDefault(require("./abi-governor.json"));
const abi_token_json_1 = __importDefault(require("./abi-token.json"));
const abi_timelock_json_1 = __importDefault(require("./abi-timelock.json"));
const ethers_multicall_1 = require("ethers-multicall");
const utils_1 = require("ethers/lib/utils");
const contract_1 = require("./contract");
const utils_2 = require("./../utils");
/**
 * Proposals adapter for OpenZeppelin Governor
 */
class OpenZeppelinGovernorAdapter {
    constructor(config) {
        var _a, _b, _c, _d;
        this.formatTokenAmount = (balance) => {
            let formattedBalance = parseFloat((0, utils_1.formatUnits)(balance, this.decimals));
            if (this.isTokenERC721) {
                formattedBalance = parseInt(balance);
            }
            return formattedBalance;
        };
        this.governanceAddress = config.governanceAddress;
        this.tokenAddress = config.tokenAddress;
        this.transports = config.transports;
        this.protocolName = config.protocolName;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.isTokenERC721 = (_b = config.isTokenERC721) !== null && _b !== void 0 ? _b : false;
        this.alternateDelegationAddress = config.alternateDelegationAddress;
        this.useTokenAddressForVotePower = (_c = config.useTokenAddressForVotePower) !== null && _c !== void 0 ? _c : false;
        this.alternateVotePowerFunctionName = config.alternateVotePowerFunctionName;
        this.decimals = (_d = config.decimals) !== null && _d !== void 0 ? _d : 18; // Provide default value if not specified
        this.boardroomAPIKey = config.boardroomAPIKey;
        this.etherscanMainnetAPIKey = config.etherscanMainnetAPIKey;
        this.etherscanOptimismAPIKey = config.etherscanOptimismAPIKey;
    }
    async getTimeDelay() {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const governanceContract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const timelockAddress = await governanceContract.timelock();
        const timelockContract = new ethers_1.Contract(timelockAddress, abi_timelock_json_1.default, rpc);
        const timeDelay = await timelockContract.getMinDelay();
        return timeDelay.toNumber();
    }
    async queueProposal(payload) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        const res = await contract.queue(payload.targets, payload.values, payload.calldata, payload.descriptionHash);
        return res.hash;
    }
    async executeProposal(payload) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        const res = await contract.execute(payload.targets, payload.values, payload.calldata, payload.descriptionHash);
        return res.hash;
    }
    // A proposal is cancellable by the proposer, but only while it is Pending state, i.e. before the vote starts.
    async cancelProposal(payload) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        const res = await contract.cancel(payload.targets, payload.values, payload.calldata, payload.descriptionHash);
        return res.hash;
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
        return 'openZeppelin';
    }
    async getProposalCreationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_governor_json_1.default, ['propose']);
        return (0, utils_2.getSelectorsFromFunctionsSignatures)(functionsSignatures);
    }
    async getVotingFunctionsSelectors() {
        const functionNames = ['castVote', 'castVoteWithReason', 'castVoteBySig'];
        return (0, utils_2.getFunctionsSelectorsWithInputs)(abi_governor_json_1.default, functionNames);
    }
    async getDelegationFunctionsSelectors() {
        const functionsSignatures = (0, utils_2.getFunctionsSignatures)(abi_token_json_1.default, ['delegate']);
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
        const governor = new contract_1.OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllProposalCreatedEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        // Optimism has a separate governor style with a voting module
        let votingModuleItems = [];
        if (this.protocolName === 'optimism') {
            const votingModuleResults = await governor.getAllProposalCreatedWithVotingModuleEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
            votingModuleItems.push(...votingModuleResults.items);
        }
        const rpc = this.transports('rpc').network(await this.getChainId());
        const items = [];
        for (const item of results.items) {
            let proposalDeadline = item.parsed.args.endBlock;
            // Optimism proposals have the wrong end block time in the events,
            // so we have to call getProposalDeadline separately to get the correct value.
            if (this.protocolName === 'optimism') {
                const deadline = await governor.getProposalDeadline(await this.getChainId(), item.parsed.args.proposalId.toString());
                proposalDeadline = ethers_1.BigNumber.from(deadline);
            }
            // Arbitrum quorum function uses ethereum mainnet blocks for its quorum function
            // event.blockNumber contains the arbitrum block number so we have to use args.startBlock instead
            let quorum = 0;
            if (this.protocolName === 'arbitrum') {
                quorum = await this.getQuorum(rpc, item.parsed.args.startBlock.toNumber());
            }
            else {
                quorum = await this.getQuorum(rpc, item.event.blockNumber);
            }
            let signatureList = [];
            try {
                signatureList = await this.getSignatureList(item.parsed.args.targets, item.parsed.args.calldatas);
            }
            catch (error) {
                console.log('Unable to get signature list for given targets of proposalId:' + item.parsed.args.proposalId);
                console.log(error);
            }
            const proposal = (0, transforms_1.mapProposal)(item.parsed, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, item.event.transactionHash, proposalDeadline, signatureList);
            items.push(proposal);
        }
        for (const item of votingModuleItems) {
            let proposalDeadline = item.parsed.args.endBlock;
            // Optimism proposals have the wrong end block time in the events,
            // so we have to call getProposalDeadline separately to get the correct value.
            if (this.protocolName === 'optimism') {
                const deadline = await governor.getProposalDeadline(await this.getChainId(), item.parsed.args.proposalId.toString());
                proposalDeadline = ethers_1.BigNumber.from(deadline);
            }
            const quorum = await this.getQuorum(rpc, item.event.blockNumber);
            const proposal = (0, transforms_1.mapProposalWithVotingModule)(item.parsed, quorum, item.event.transactionHash, proposalDeadline);
            items.push(proposal);
        }
        return { items, nextCursor: results.nextCursor };
    }
    async getSignatureList(targets, calldatas) {
        const signatureList = [];
        let index = 0;
        for (const target of targets) {
            const calldata = calldatas[index];
            const callDataFunctionSelector = calldata.slice(0, 10);
            const targetABI = await this.getContract(target);
            for (const obj of targetABI) {
                if (obj.type === 'function') {
                    const inputTypes = obj.inputs.map((input) => input.type).join(',');
                    const functionSignature = `${obj.name}(${inputTypes})`;
                    const selector = ethers_1.utils.id(functionSignature).slice(0, 10);
                    if (selector === callDataFunctionSelector) {
                        signatureList.push(functionSignature);
                    }
                }
            }
            index++;
        }
        return signatureList;
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        const governor = new contract_1.OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
        const rpc = this.transports('rpc').network(await this.getChainId());
        const parsedEvent = JSON.parse(event);
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const parsedLog = contract.interface.parseLog(parsedEvent.event.data.block.logs[0]);
        // For some reason values are not properly labeled in parsedLog output
        const values = parsedLog.args[3];
        let proposalDeadline = ethers_1.BigNumber.from(parsedLog.args.endBlock);
        // Optimism proposals have the wrong end block time in the events,
        // so we have to call getProposalDeadline separately to get the correct value.
        if (this.protocolName === 'optimism') {
            const deadline = await governor.getProposalDeadline(await this.getChainId(), parsedLog.args.proposalId.toString());
            proposalDeadline = ethers_1.BigNumber.from(deadline);
        }
        // Arbitrum quorum function uses ethereum mainnet blocks for its quorum function
        // event.blockNumber contains the arbitrum block number so we have to use args.startBlock instead
        let quorum = 0;
        if (this.protocolName === 'arbitrum') {
            quorum = await this.getQuorum(rpc, ethers_1.BigNumber.from(parsedLog.args.startBlock).toNumber());
        }
        else {
            quorum = await this.getQuorum(rpc, blockNumber);
        }
        let signatureList = [];
        try {
            signatureList = await this.getSignatureList(parsedLog.args.targets, parsedLog.args.calldatas);
        }
        catch (error) {
            console.log('Unable to get signature list for given targets of proposalId:' + parsedLog.args.proposalId);
            console.log(error);
        }
        const proposalCreatedLog = {
            name: 'ProposalCreated',
            signature: parsedLog.signature,
            eventFragment: parsedLog.eventFragment,
            topic: parsedLog.topic,
            args: {
                proposalId: ethers_1.BigNumber.from(parsedLog.args.proposalId),
                proposer: parsedLog.args.proposer,
                targets: parsedLog.args.targets,
                values: values.map((value) => ethers_1.BigNumber.from(value)),
                signatures: signatureList,
                calldatas: parsedLog.args.calldatas,
                startBlock: ethers_1.BigNumber.from(parsedLog.args.startBlock),
                endBlock: ethers_1.BigNumber.from(parsedLog.args.endBlock),
                description: parsedLog.args.description
            }
        };
        const proposal = (0, transforms_1.mapProposal)(proposalCreatedLog, ['AGAINST', 'FOR', 'ABSTAIN'], quorum, transactionHash, proposalDeadline, signatureList);
        return proposal;
    }
    async getQuorum(rpc, blockNumber) {
        let quorum = 0;
        try {
            const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
            const quorumResult = await contract.quorum(blockNumber);
            quorum = parseInt(ethers_1.ethers.utils.formatUnits(quorumResult, 18));
        }
        catch (err) {
            console.log("Error querying quorum value. Using 0 for now");
            console.log(err);
        }
        return quorum;
    }
    async getProposalEvents(pagination = {}) {
        const governor = new contract_1.OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
        const allResults = [];
        const results = await governor.getProposalEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        allResults.push(...results.items);
        if (this.protocolName === 'optimism') {
            const votingModuleResults = await governor.getProposalEventsWithVotingModule(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
            allResults.push(...votingModuleResults.items);
        }
        const events = (0, transforms_1.mapProposalEvents)(results.items);
        return { items: events };
    }
    async getProposalIdFromEvent(data) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const parsedEvent = JSON.parse(data);
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        const parsedLog = contract.interface.parseLog(parsedEvent);
        const proposalId = parsedLog.args.proposalId.toString();
        return proposalId;
    }
    async getVotes(pagination = {}) {
        const governor = new contract_1.OpenZeppelinGovernanceContract(this.governanceAddress, this.transports);
        const results = await governor.getAllVoteEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const votes = (0, transforms_1.mapVotes)(results.items, this.decimals);
        return { items: votes, nextCursor: results.nextCursor };
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const parsedEvent = JSON.parse(event);
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, rpc);
        // const parsedLog = contract.interface.parseLog(parsedEvent);
        const parsedLog = contract.interface.parseLog(parsedEvent.event.data.block.logs[0]);
        let voteEventLog;
        if (parsedLog.args.params) {
            voteEventLog = {
                name: 'VoteCastWithParams',
                signature: parsedLog.signature,
                eventFragment: parsedLog.eventFragment,
                topic: parsedLog.topic,
                args: {
                    proposalId: ethers_1.BigNumber.from(parsedLog.args.proposalId),
                    voter: parsedLog.args.voter,
                    support: parsedLog.args.support,
                    weight: parsedLog.args.weight,
                    reason: parsedLog.args.reason,
                    params: parsedLog.args.params,
                }
            };
        }
        else {
            voteEventLog = {
                name: 'VoteCast',
                signature: parsedLog.signature,
                eventFragment: parsedLog.eventFragment,
                topic: parsedLog.topic,
                args: {
                    proposalId: ethers_1.BigNumber.from(parsedLog.args.proposalId),
                    voter: parsedLog.args.voter,
                    support: parsedLog.args.support,
                    weight: parsedLog.args.weight,
                    reason: parsedLog.args.reason,
                }
            };
        }
        const vote = (0, transforms_1.mapVoteEvent)(voteEventLog, blockNumber, transactionHash, this.decimals);
        return vote;
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
        const { proposalId, choice, power, proposalRefId, adapter } = params;
        let { identifier, reason } = params;
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.governanceAddress, abi_governor_json_1.default, signer);
        let res;
        // If the choice is an array we use the approval voting cast vote function for optimism
        if (this.protocolName === 'optimism' && choice instanceof Array) {
            reason = reason !== null && reason !== void 0 ? reason : '';
            const VOTE_PARAMS_ENCODING = 'VOTE_PARAMS_ENCODING(uint256[] options)';
            const paramEncoding = ethers_1.ethers.utils.FunctionFragment.fromString(VOTE_PARAMS_ENCODING);
            // Choices haves to be in ascending order
            const encodedParams = ethers_1.ethers.utils.defaultAbiCoder.encode(paramEncoding.inputs, [choice.sort()]);
            res = await contract.castVoteWithReasonAndParams(proposalId, 0, reason, encodedParams);
        }
        else if (reason) {
            res = await contract.castVoteWithReason(proposalId, choice, reason);
        }
        else {
            res = await contract.castVote(proposalId, choice);
        }
        identifier = identifier !== null && identifier !== void 0 ? identifier : 'default';
        try {
            const apiCalls = Promise.all([
                this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'castVoteOpenZeppelin',
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
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, signer);
        const res = await contract.delegate(delegatee);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateOpenZeppelin',
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
        // If an alternate delegation address is provided use that as the source of truth
        let delegationAddress = this.tokenAddress;
        if (this.alternateDelegationAddress) {
            delegationAddress = this.alternateDelegationAddress;
        }
        const governor = new contract_1.OpenZeppelinGovernanceContract(delegationAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items.map((i) => (0, transforms_1.mapDelegationEvents)(i, this.decimals));
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        // If an alternate delegation address is provided use that as the source of truth
        let delegationAddress = this.tokenAddress;
        if (this.alternateDelegationAddress) {
            delegationAddress = this.alternateDelegationAddress;
        }
        const contract = new ethers_1.Contract(delegationAddress, abi_token_json_1.default, rpc);
        return await contract.delegates(address);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        // If an alternate delegation address is provided use that as the source of truth
        let delegationAddress = this.tokenAddress;
        if (this.alternateDelegationAddress) {
            delegationAddress = this.alternateDelegationAddress;
        }
        const contract = new ethers_1.Contract(delegationAddress, abi_token_json_1.default, rpc);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.delegates(address));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getBalance(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.tokenAddress, abi_token_json_1.default, rpc);
        const calls = addresses.map((a) => contract.balanceOf(a));
        const balances = await Promise.all(calls);
        return balances.map((balance, idx) => {
            return { address: addresses[idx], balance: this.formatTokenAmount(balance) };
        });
    }
    async getVotePower(addresses, blockHeight) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const provider = new ethers_multicall_1.Provider(rpc, await this.getChainId());
        let multiContract = new ethers_multicall_1.Contract(this.governanceAddress, abi_governor_json_1.default);
        const votePowerFunction = this.alternateVotePowerFunctionName || 'getVotes';
        // Right now only optimism and arbitrum use this
        if (this.useTokenAddressForVotePower) {
            multiContract = new ethers_multicall_1.Contract(this.tokenAddress, abi_token_json_1.default);
            const iface = new utils_1.Interface(abi_token_json_1.default);
            const calls = addresses.map((a) => {
                const callData = iface.encodeFunctionData(votePowerFunction, [a]);
                return rpc.call({
                    to: this.tokenAddress,
                    data: callData,
                });
            });
            const powers = await Promise.all(calls);
            return powers.map((power, idx) => {
                return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
            });
        }
        let info;
        if (blockHeight === undefined) {
            const latestBlock = await rpc.getBlockNumber();
            const calls = addresses.map((a) => multiContract.getVotes(a, latestBlock - 5));
            const powers = await provider.all(calls);
            info = powers.map((power, idx) => {
                return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
            });
        }
        else {
            const iface = new utils_1.Interface(abi_governor_json_1.default);
            const calls = addresses.map((a) => {
                const callData = iface.encodeFunctionData(votePowerFunction, [a, blockHeight]);
                return rpc.call({
                    to: this.governanceAddress,
                    data: callData,
                });
            });
            const powers = await Promise.all(calls);
            info = powers.map((power, idx) => {
                return { protocol: this.protocolName, address: addresses[idx], power: this.formatTokenAmount(power) };
            });
        }
        return info;
    }
    async getContract(contractAddress) {
        if (this.chainId === 5) {
            const resp = await this.transports('http').getJson(`https://api-goerli.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
                contractAddress);
            return JSON.parse(resp.data.result);
        }
        else if (this.chainId === 10) {
            const resp = await this.transports('http').getJson(`https://api-optimistic.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanOptimismAPIKey}&address=` +
                contractAddress);
            return JSON.parse(resp.data.result);
        }
        else {
            const resp = await this.transports('http').getJson(`https://api.etherscan.io/api?module=contract&action=getabi&apikey=${this.etherscanMainnetAPIKey}&address=` +
                contractAddress);
            console.log(resp);
            return JSON.parse(resp.data.result);
        }
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
     * @param signatures openzeppelin governor doesn't use this field
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
        // OpenZeppelin doesn't use the signatures field
        const iface = new utils_1.Interface(abi_governor_json_1.default);
        const encodedFunctionData = iface.encodeFunctionData('propose', [
            payload.targets,
            payload.values,
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
                action: 'createOnChainProposalOpenZeppelin',
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
    async getTransferEvents(pagination = {}) {
        const governor = new contract_1.OpenZeppelinGovernanceContract(this.tokenAddress, this.transports);
        const results = await governor.getTransferEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock, this.isTokenERC721);
        const events = results.items.map((log) => {
            // If the contract is an nft based contract assume the transfer amount is 1
            let value = (0, utils_1.formatUnits)(1, 0);
            if (!this.isTokenERC721) {
                value = (0, utils_1.formatUnits)(log.parsed.args.value, this.decimals);
            }
            return {
                from: log.parsed.args.from,
                to: log.parsed.args.to,
                value: value,
                txHash: log.event.transactionHash,
            };
        });
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        return [];
    }
}
exports.OpenZeppelinGovernorAdapter = OpenZeppelinGovernorAdapter;
//# sourceMappingURL=adapter.js.map