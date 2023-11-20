"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SnapshotAdapter = exports.mapGraphProposal = exports.normalizeSnapshot = void 0;
const gov_lib_1 = require("@boardroom/gov-lib");
const abi_delegator_json_1 = __importDefault(require("./abi-delegator.json"));
const sign_1 = __importDefault(require("@boardroom/snapshot.js/dist/sign"));
const utils_1 = __importDefault(require("@boardroom/snapshot.js/dist/utils"));
const graph_1 = require("./graph");
const groupBy_1 = __importDefault(require("lodash/groupBy"));
const ethers_1 = require("ethers");
const utils_2 = require("ethers/lib/utils");
const contract_1 = require("./contract");
const transforms_1 = require("./transforms");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { init, encrypt } = require('@shutter-network/shutter-crypto');
// The hard coded value that Gnosis Safe contract's isValidSignature method returns if the message was signed
// https://github.com/gnosis/safe-contracts/blob/dec13f7cdab62056984343c4edfe40df5a1954dc6/contracts/handler/CompatibilityFallbackHandler.sol#L19
const GNOSIS_VALID_SIGNATURE_MAGIC_VALUE = '0x1626ba7e';
const GNOSIS_SAFE_SIGN_MESSAGE_EVENT_NAME = 'SignMsg';
/** handle some odd data that comes back from snapshot */
const normalizeSnapshot = (snapshot) => {
    // some goof balls put in absurdly large numbers for the snapshot (block)
    // number, so large it overflows a 32-bit (signed) integer. We cap at that
    // limit, which gives us a runway of over 1000 years of 15 second blocks,
    // which is likely enough for now
    const maxBlockNumber = 2147483647; // 2^31 - 1,
    const blockNumber = Math.floor(Math.min(maxBlockNumber, Number(snapshot !== null && snapshot !== void 0 ? snapshot : 1)));
    return blockNumber;
};
exports.normalizeSnapshot = normalizeSnapshot;
/**
 * Project snapshot's graph response into interop proposal shape
 */
const mapGraphProposal = (ssProposal) => {
    var _a;
    const scores = (_a = ssProposal.scores) === null || _a === void 0 ? void 0 : _a.map((score, index) => ({
        choice: `${index}`,
        total: `${score}`,
    }));
    return {
        id: ssProposal.id,
        title: ssProposal.title,
        proposer: ssProposal.author,
        choices: ssProposal.choices,
        content: ssProposal.body,
        externalUrl: `https://snapshot.org/#/${ssProposal.space.id}/proposal/${ssProposal.id}`,
        startTime: { timestamp: ssProposal.start },
        endTime: { timestamp: ssProposal.end },
        blockNumber: (0, exports.normalizeSnapshot)(ssProposal.snapshot),
        type: ssProposal.type,
        scores,
        privacy: ssProposal.privacy ? ssProposal.privacy : '',
        quorum: Math.round(ssProposal.quorum),
        flagged: ssProposal.flagged,
    };
};
exports.mapGraphProposal = mapGraphProposal;
/**
 * Implement the proposals adapter via the snapshot API
 */
class SnapshotAdapter {
    constructor(config) {
        var _a;
        this.snapshotDelegatorAddress = '0x469788fe6e9e9681c6ebf3bf78e7fd26fc015446';
        this.spaceName = config.spaceName;
        this.transports = config.transports;
        this.cname = config.cname;
        this.chainId = (_a = config.chainId) !== null && _a !== void 0 ? _a : 1;
        this.snapshotApiKey = config.snapshotApiKey;
        this.boardroomAPIKey = config.boardroomAPIKey;
        this.baseUrl = 'https://hub.snapshot.org/api';
        this.graph = new graph_1.SnapshotGraphAPI(this.transports, this.snapshotApiKey);
        this.protocolName = this.cname;
    }
    async getChainId() {
        return this.chainId ? this.chainId : 1;
    }
    async getTokenAddress() {
        throw new Error("Snapshot adapters don't have a token address");
    }
    async getFramework() {
        return 'snapshot';
    }
    async getSnapshotSpaceName() {
        return this.spaceName;
    }
    //snapshot has no smart contract
    async getProposalCreationFunctionsSelectors() {
        return [];
    }
    async getVotingFunctionsSelectors() {
        return {};
    }
    async getDelegationFunctionsSelectors() {
        return [];
    }
    async getProposalCreationContractAddress() {
        return '';
    }
    async getDelegationContractAddress() {
        return '';
    }
    async getVotingContractAddress() {
        return '';
    }
    async delegateVotingPower(delegatee, identifier) {
        const signer = this.transports('signer').signer;
        const contract = new ethers_1.Contract(this.snapshotDelegatorAddress, abi_delegator_json_1.default, signer);
        // If no spaceName is set then delegating enables delegation for *all* spaces
        const spaceNameBytes = ethers_1.ethers.utils.formatBytes32String(this.spaceName);
        const res = await contract.setDelegate(spaceNameBytes, delegatee);
        try {
            await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                protocol: this.protocolName,
                action: 'delegateSnapshot',
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
        const governor = new contract_1.SnapshotDelegatorContract(this.snapshotDelegatorAddress, this.transports);
        const results = await governor.getDelegationEvents(await this.getChainId(), pagination.cursor, pagination.startBlock, pagination.endBlock);
        const events = results.items
            .map((i) => (0, transforms_1.mapDelegationEvents)(i))
            .filter((e) => {
            try {
                if (this.spaceName === ethers_1.ethers.utils.parseBytes32String(e.snapshotId)) {
                    return true;
                }
                return false;
            }
            catch (err) {
                return false;
            }
        });
        return { items: events, nextCursor: results.nextCursor };
    }
    async getDelegation(address) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.snapshotDelegatorAddress, abi_delegator_json_1.default, rpc);
        const spaceNameBytes = ethers_1.ethers.utils.formatBytes32String(this.spaceName);
        return await contract.delegation(address, spaceNameBytes);
    }
    async getDelegations(addresses) {
        const rpc = this.transports('rpc').network(await this.getChainId());
        const contract = new ethers_1.Contract(this.snapshotDelegatorAddress, abi_delegator_json_1.default, rpc);
        const spaceNameBytes = ethers_1.ethers.utils.formatBytes32String(this.spaceName);
        const calls = [];
        for (const address of addresses) {
            calls.push(contract.delegation(address, spaceNameBytes));
        }
        const delegations = await Promise.all(calls);
        return delegations.map((addressDelegatedTo, idx) => {
            return { address: addresses[idx], addressDelegatedTo };
        });
    }
    async getExternalLink() {
        return {
            name: 'Snapshot.org',
            url: `https://snapshot.org/#/${this.spaceName}`,
        };
    }
    async getProposals(pagination = {}) {
        var _a, _b;
        const { cursor, limit, status, proposalIds } = pagination;
        const offset = (_b = (_a = (0, gov_lib_1.decodeCursor)(cursor)) === null || _a === void 0 ? void 0 : _a.offset) !== null && _b !== void 0 ? _b : 0;
        const { proposals } = await this.graph.getProposalsBySpace(this.spaceName, offset, limit, status, proposalIds);
        // next cursor is just the used offset + how many we got back
        const nextCursor = proposals.length
            ? (0, gov_lib_1.encodeCursor)({ offset: offset + proposals.length })
            : undefined;
        const mapped = proposals.map(exports.mapGraphProposal);
        const page = { nextCursor, items: mapped };
        return page;
    }
    async getProposalFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
    async getProposalIdFromEvent() {
        throw new Error('Function not defined for this adapter');
    }
    async getProposalEvents() {
        // snapshot does not have proposal events
        return { items: [] };
    }
    async getVotes(pagination = {}) {
        var _a, _b;
        const { cursor, limit = 200, proposalIds } = pagination;
        const pCursor = (0, gov_lib_1.decodeCursor)(cursor);
        const lastCreatedAt = (_a = pCursor === null || pCursor === void 0 ? void 0 : pCursor.created) !== null && _a !== void 0 ? _a : 0;
        const offset = (_b = pCursor === null || pCursor === void 0 ? void 0 : pCursor.offset) !== null && _b !== void 0 ? _b : 0;
        let resp;
        if (proposalIds && proposalIds.length === 1) {
            resp = await this.graph.getVotesForProposal(this.spaceName, proposalIds[0].toString(), lastCreatedAt, limit, offset);
        }
        else {
            resp = await this.graph.getVotes(this.spaceName, lastCreatedAt, limit, offset);
        }
        const { votes } = resp;
        // our GetVotesResponse (and code downstream of this method) assume proposal
        // is not null, but the graph schema does allow for it to be nullable. To
        // avoid having to narrow and filter in the rest of the codebase, we're
        // filtering here at the adapter implementation level
        const filteredVotesForNullProposalId = votes.filter((v) => v.proposal !== null);
        // a map from (proposal, voter) -> Vote, this is our final output
        const projectedVotes = new Map();
        // Group all fetched votes by proposal so we can resolve the scores with the
        // proposal-specific network, snapshot, and strategies
        const grouped = (0, groupBy_1.default)(filteredVotesForNullProposalId, (v) => v.proposal.id);
        for (const votes of Object.values(grouped)) {
            // project all votes in this batch to interop model
            for (const vote of votes) {
                const power = vote.vp;
                if (power === undefined) {
                    console.warn(`unresolved voter power for space:${this.spaceName} voter:${vote.voter} proposal:${vote.proposal.id}`);
                    continue;
                }
                let voteChoice = vote.choice;
                if (vote.proposal.privacy === 'shutter' && vote.choice.toString().startsWith('0x')) {
                    voteChoice = -1;
                }
                // Handle when vote choice arrays have number strings in them.
                if (Array.isArray(voteChoice)) {
                    const tempArray = [];
                    for (const choice of voteChoice) {
                        tempArray.push(Number(choice));
                    }
                    voteChoice = tempArray;
                }
                const sdkVote = {
                    power,
                    address: vote.voter,
                    proposalId: vote.proposal.id,
                    choice: voteChoice,
                    time: { timestamp: Number(vote.created) },
                    privacy: vote.proposal.privacy,
                    reason: vote.reason,
                };
                projectedVotes.set(`${vote.proposal.id}:${vote.voter}`, sdkVote);
            }
        }
        // Now w/ all the scores resolved after grouping by proposal, project the
        // originally resolved votes into our computed interop models (to preserve
        // order). We could have holes in the case of score computation not working,
        // so we cull those as well
        const sdkVotes = filteredVotesForNullProposalId
            .map((v) => { var _a; return (_a = projectedVotes.get(`${v.proposal.id}:${v.voter}`)) !== null && _a !== void 0 ? _a : null; })
            .filter((v) => v !== null);
        // use the last "created" value in our cursor to resume stream next request
        let nextCursor = undefined;
        if (votes.length) {
            const last = votes[votes.length - 1];
            // if the timestamps are the same, we need to use offset to further the
            // stream head or it will never get past this "chunk"
            const offset = last.created === lastCreatedAt ? votes.length : 0;
            nextCursor = (0, gov_lib_1.encodeCursor)({ created: last.created, offset });
        }
        return { items: sdkVotes, nextCursor };
    }
    async getVoteFromEvent(blockNumber, transactionHash, event) {
        throw new Error('Function not defined for this adapter');
    }
    async getEncodedCastVoteData() {
        throw new Error('Snapshot does not support encoded cast vote data');
    }
    async castVote(params) {
        const { proposalId, choice, power, proposalRefId, identifier, adapter, isContractWallet, reason, web3, type, isPrivate, } = params;
        if (web3 && type) {
            const [account] = await web3.listAccounts();
            let hub = 'https://hub.snapshot.org';
            if (isContractWallet) {
                console.log('Contract wallet detected');
                hub = 'https://relayer.snapshot.org';
            }
            const client = new sign_1.default(hub);
            let receipt;
            if (isPrivate) {
                const encryptedChoice = await this._encryptChoice(JSON.stringify(choice), proposalId);
                receipt = await client.vote(web3, account, {
                    space: this.spaceName,
                    proposal: proposalId,
                    type: type,
                    choice: encryptedChoice,
                    reason,
                    privacy: 'shutter',
                    app: 'boardroom',
                });
            }
            else {
                receipt = await client.vote(web3, account, {
                    space: this.spaceName,
                    proposal: proposalId,
                    type: type,
                    choice: choice,
                    reason,
                    app: 'boardroom',
                });
            }
            try {
                const apiCalls = Promise.all([
                    this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                        protocol: this.protocolName,
                        action: 'castVoteSnapshot',
                        hashId: receipt.ipfs,
                        proposalId: proposalId,
                        userAddress: account,
                        identifier,
                        separateAction: 'castVote',
                        separateFramework: await this.getFramework(),
                    }),
                    this.transports('http').postJson(`https://api.boardroom.info/v1/voters/addOrUpdatePendingVote?key=${this.boardroomAPIKey}`, {
                        cname: this.protocolName,
                        choices: choice,
                        address: account,
                        txnHash: receipt.ipfs,
                        status: 'success',
                        power,
                        proposalRefId,
                        adapter: adapter || 'snapshot',
                    }),
                ]);
                await apiCalls;
            }
            catch (err) {
                console.log(err);
            }
            return receipt.ipfs;
        }
        else {
            throw new Error('Snapshot votes must provide a ProposalType and a Web3Provider');
        }
    }
    async getVotePower(addresses, blockHeight) {
        const space = await this.graph.getSpace(this.spaceName);
        const info = [];
        for (const address of addresses) {
            try {
                const result = await this._getScoresAtBlock([address], this.spaceName, space.strategies, space.network, blockHeight !== null && blockHeight !== void 0 ? blockHeight : 'latest');
                for (const r of result) {
                    if (r.length === 2) {
                        const votePowerInfo = {
                            protocol: this.protocolName,
                            address,
                            power: r[1],
                        };
                        info.push(votePowerInfo);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        return info;
    }
    async getDelegatableVotePower(addresses, blockHeight) {
        const space = await this.graph.getSpace(this.spaceName);
        const info = [];
        // Use all strategies except the delegation strategy as delegated power
        // does not get passed on to the account that they are delegating to.
        const strategies = space.strategies.filter((s) => s.name !== 'delegation');
        for (const address of addresses) {
            try {
                const result = await this._getScoresAtBlock([address], this.spaceName, strategies, space.network, blockHeight !== null && blockHeight !== void 0 ? blockHeight : 'latest');
                for (const r of result) {
                    if (r.length === 2) {
                        const votePowerInfo = {
                            address,
                            power: r[1],
                            protocol: this.protocolName,
                        };
                        info.push(votePowerInfo);
                    }
                }
            }
            catch (err) {
                console.log(err);
            }
        }
        return info;
    }
    async getCanonicalProposalTimeFormat() {
        return 'timestamp';
    }
    async createProposal({ title, content, choices, startTime, endTime, blockNumber }, isContractWallet, identifier, web3) {
        if (web3) {
            if ('blockNumber' in startTime || 'blockNumber' in endTime) {
                throw new Error('blockNumber time format not yet supported for proposal start/end dates');
            }
            let hub = 'https://hub.snapshot.org';
            if (isContractWallet) {
                hub = 'https://relayer.snapshot.org';
            }
            const client = new sign_1.default(hub);
            const [account] = await web3.listAccounts();
            const receipt = await client.proposal(web3, account, {
                space: this.spaceName,
                type: 'single-choice',
                title: title,
                body: content,
                choices: choices,
                start: startTime.timestamp,
                end: endTime.timestamp,
                snapshot: blockNumber,
                plugins: JSON.stringify({}),
                discussion: '',
                app: 'boardroom',
            });
            try {
                await this.transports('http').postJson(`https://api.boardroom.info/v1/addUserAction?key=${this.boardroomAPIKey}`, {
                    protocol: this.protocolName,
                    action: 'createProposalSnapshot',
                    hashId: receipt,
                    userAddress: account,
                    identifier,
                    separateAction: 'createProposal',
                    separateFramework: await this.getFramework(),
                });
            }
            catch (err) {
                console.log(err);
            }
            return receipt.ipfs;
        }
        else {
            throw new Error('Must provide Web3Provider for creating snapshot proposals');
        }
    }
    async _getScoresAtBlock(addresses, space, strategies, network, blockNumber) {
        var _a;
        let url = `https://score.snapshot.org`;
        if (this.snapshotApiKey) {
            url = `https://score.snapshot.org/?apiKey=${this.snapshotApiKey}`;
        }
        const scores = await utils_1.default.getScores(space, strategies, network, addresses, blockNumber === 'latest' ? 'latest' : Number(blockNumber), url);
        // reduce the the scores from all the diff strategies into a map from
        // address -> total power
        const scoresByAddress = new Map();
        for (const scoredStrategy of scores) {
            for (const [address, power] of Object.entries(scoredStrategy)) {
                scoresByAddress.set(address, ((_a = scoresByAddress.get(address)) !== null && _a !== void 0 ? _a : 0) + Number(power));
            }
        }
        return scoresByAddress;
    }
    async _getScores(addresses, space, proposal) {
        const promises = addresses.map((address) => this.graph.getScores(address, space, proposal));
        const vpArray = [];
        const results = await Promise.all(promises);
        for (const result of results) {
            vpArray.push(result);
        }
        return vpArray;
    }
    // Based on snapshots implementation here https://github.com/snapshot-labs/snapshot/blob/develop/src/helpers/shutter.ts
    async _encryptChoice(choice, id) {
        var _a;
        await init('https://snapshot.org/assets/shutter-crypto.247202d0.wasm');
        const bytesChoice = (0, utils_2.toUtf8Bytes)(choice);
        const message = ethers_1.ethers.utils.arrayify(bytesChoice);
        const eonPublicKey = ethers_1.ethers.utils.arrayify('0x0e6493bbb4ee8b19aa9b70367685049ff01dc9382c46aed83f8bc07d2a5ba3e6030bd83b942c1fd3dff5b79bef3b40bf6b666e51e7f0be14ed62daaffad47435265f5c9403b1a801921981f7d8659a9bd91fe92fb1cf9afdb16178a532adfaf51a237103874bb03afafe9cab2118dae1be5f08a0a28bf488c1581e9db4bc23ca');
        const is32ByteString = id.substring(0, 2) === '0x';
        const proposalId = ethers_1.ethers.utils.arrayify(is32ByteString ? id : ethers_1.ethers.utils.formatBytes32String(id));
        const sigma = ethers_1.ethers.utils.arrayify(ethers_1.ethers.BigNumber.from(ethers_1.ethers.utils.randomBytes(32)));
        const encryptedMessage = await encrypt(message, eonPublicKey, proposalId, sigma);
        return (_a = ethers_1.ethers.utils.hexlify(encryptedMessage)) !== null && _a !== void 0 ? _a : null;
    }
    async getBalance(addresses) {
        return [];
    }
}
exports.SnapshotAdapter = SnapshotAdapter;
//# sourceMappingURL=adapter.js.map