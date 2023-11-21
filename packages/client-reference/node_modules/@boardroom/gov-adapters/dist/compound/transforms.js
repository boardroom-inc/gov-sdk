"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compoundChoice = exports.mapDelegationEvents = exports.mapProposalEvent = exports.mapVotes = exports.mapProposal = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
const utils_1 = require("../utils");
/**
 * Given some markdown-ish payload, extract the title and content
 */
const extractTitle = (description, defaultTitle) => {
    // descriptions seem to start with a markdown header always
    let match = description.match(/^\s*(.*)\n\s*([\S\s]*)$/);
    if (!match) {
        // uniswap proposal to upgrade to bravo has bad content formatting
        match = description.match(/^# (.*?) ## ([\S\s]*)/);
    }
    // if the description is only one line, we use it as title and leave the content empty
    const isOneLine = !/\r|\n/.exec(description);
    if (!match && isOneLine) {
        return { title: description, content: '' };
    }
    if (!match) {
        return { title: defaultTitle, content: description };
    }
    const [, header, content] = match;
    const title = header.replace(/^\s*#\s*/, ''); // remove header
    return { title, content };
};
exports.extractTitle = extractTitle;
/**
 * Map a compound ProposalCreated event into a governance Proposal model
 */
const mapProposal = (event, choices, quorum, txHash) => {
    const { title, content } = (0, exports.extractTitle)(event.args.description, `Proposal ${event.args.id.toString()}`);
    const { args } = event;
    const executables = (0, utils_1.makeExecutablesForProposal)({
        targets: args.targets,
        values: args.values,
        signatures: args.signatures,
        calldatas: args.calldatas,
    });
    return {
        id: args.id.toString(),
        blockNumber: args.startBlock.toNumber(),
        choices,
        startTime: { blockNumber: args.startBlock.toNumber() },
        endTime: { blockNumber: args.endBlock.toNumber() },
        proposer: args.proposer,
        title,
        content,
        executables,
        quorum,
        txHash,
    };
};
exports.mapProposal = mapProposal;
/**
 * Convert voting event logs into interop Votes
 */
const mapVotes = (logs, isTokenERC721) => {
    const votes = logs.map((log) => {
        const { args } = log.parsed;
        const power = isTokenERC721 ? parseInt((0, units_1.formatUnits)(args.votes, 0)) : parseFloat((0, units_1.formatUnits)(args.votes, 18));
        return {
            address: args.voter,
            choice: (0, exports.compoundChoice)(args.support),
            power: power,
            time: { blockNumber: log.event.blockNumber },
            reason: 'reason' in args ? args.reason : undefined,
            proposalId: args.proposalId.toString(),
            txHash: log.event.transactionHash,
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Convert a compound proposal event into our interop model
 */
const mapProposalEvent = (log) => {
    let state;
    switch (log.parsed.name) {
        case 'ProposalCanceled':
            state = 'canceled';
            break;
        case 'ProposalExecuted':
            state = 'executed';
            break;
        case 'ProposalQueued':
            state = 'queued';
            break;
        case 'ProposalCreated':
            state = 'pending';
            break;
        // statically exhaustive cases, do not need default case
    }
    return {
        state,
        proposalId: log.parsed.args.id.toString(),
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash
    };
};
exports.mapProposalEvent = mapProposalEvent;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log, isTokenERC721) => {
    if (log.parsed.name === 'DelegateChanged') {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: log.parsed.args.fromDelegate,
            toDelegate: log.parsed.args.toDelegate,
            amount: '',
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'MOVED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
    else {
        const amount = isTokenERC721
            ? parseInt((0, units_1.formatUnits)(log.parsed.args.newBalance, 0))
            : parseFloat((0, units_1.formatUnits)(log.parsed.args.newBalance, 18));
        return {
            delegator: log.event.address,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegate,
            amount: amount.toString(),
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
/**
 * Alpha -> Bravo upgrade made it so that "support" is a number instead of a
 * bool, this will normalize either into a number
 */
const compoundChoice = (support) => {
    if (typeof support === 'number') {
        return support;
    }
    return support ? 1 : 0;
};
exports.compoundChoice = compoundChoice;
//# sourceMappingURL=transforms.js.map