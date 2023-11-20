"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compoundChoice = exports.mapDelegationEvents = exports.mapProposalEvent = exports.mapVotes = exports.mapProposal = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
/**
 * Given some markdown-ish payload, extract the title and content
 */
const extractTitle = (description, defaultTitle) => {
    // descriptions seem to start with a markdown header always
    const match = description.match(/^\s*#{1,6}\s.*$/m);
    if (match) {
        const header = match[0];
        const content = description.substring(header.length).replace(/\0/g, '');
        const title = header.replace(/^\s*#\s*/, ''); // remove header
        return { title, content };
    }
    // if the description is only one line, we use it as title and leave the content empty
    const isOneLine = !/\r|\n/.exec(description);
    if (isOneLine) {
        return { title: description, content: '' };
    }
    return { title: defaultTitle, content: description };
};
exports.extractTitle = extractTitle;
/**
 * Map a interest ProposalCreated event into a governance Proposal model
 */
const mapProposal = (event, choices, quorum, txHash) => {
    let title, content = '';
    try {
        const { title: t, content: c } = (0, exports.extractTitle)(event.args.description, `Proposal ${event.args.id.toString()}`);
        title = t;
        content = c;
    }
    catch (e) {
        title = `Proposal ${event.args.id.toString()}`;
    }
    const { args } = event;
    return {
        id: args.id.toString(),
        blockNumber: args.startBlock.toNumber(),
        choices,
        startTime: { blockNumber: args.startBlock.toNumber() },
        endTime: { blockNumber: args.endBlock.toNumber() },
        proposer: args.proposer,
        title,
        content,
        quorum,
        txHash,
    };
};
exports.mapProposal = mapProposal;
/**
 * Convert voting event logs into interop Votes
 */
const mapVotes = (logs) => {
    const votes = logs.map((log) => {
        const { args } = log.parsed;
        return {
            address: args.voter,
            choice: (0, exports.compoundChoice)(args.support),
            // TODO: this should probably be something that is configurable on the
            // adapter level, but defaults to 18
            power: parseFloat((0, units_1.formatUnits)(args.votes, 18)),
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
 * Convert a interest proposal event into our interop model
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
        txHash: log.event.transactionHash,
    };
};
exports.mapProposalEvent = mapProposalEvent;
/**
 * Convert a interest delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
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
        return {
            delegator: log.event.address,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegate,
            amount: (0, units_1.formatUnits)(log.parsed.args.newBalance, 18),
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