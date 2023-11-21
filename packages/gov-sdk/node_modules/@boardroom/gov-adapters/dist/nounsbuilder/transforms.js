"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvent = exports.mapVotes = exports.mapProposal = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
const utils_1 = require("../utils");
const extractTitle = (description, defaultTitle) => {
    const match = description.match(/^.*&&[\S\s]*$/);
    if (!match) {
        return { title: defaultTitle, content: description };
    }
    const [title, ...rest] = description.split('&&');
    // in case there's more than 1 instance of '&&', we only treat the first one as
    // separator between title and content
    const content = rest.join('&&');
    return { title, content };
};
exports.extractTitle = extractTitle;
/**
 * Map a nounsBuilder ProposalCreated event into interop Proposal model
 */
const mapProposal = (event, choices, blockNumber, quorum, txHash) => {
    const { title, content } = (0, exports.extractTitle)(event.args.description, `Proposal ${event.args.proposalId.toString()}`);
    const { args } = event;
    const executables = (0, utils_1.makeExecutablesForProposal)({
        targets: args.targets,
        values: args.values,
        signatures: args.signatures,
        calldatas: args.calldatas,
    });
    return {
        id: args.proposalId.toString(),
        blockNumber: blockNumber,
        choices,
        startTime: { timestamp: args.proposal[5] },
        endTime: { timestamp: args.proposal[6] },
        proposer: args.proposal[0],
        title,
        content,
        executables,
        quorum,
        txHash
    };
};
exports.mapProposal = mapProposal;
/**
 * Convert NounsBuilder voting event logs into interop Votes
 */
const mapVotes = (logs) => {
    const votes = logs.map((log) => {
        const { args } = log.parsed;
        return {
            address: args.voter,
            choice: parseFloat((0, units_1.formatUnits)(args.support, 0)),
            power: parseFloat((0, units_1.formatUnits)(args.weight, 0)),
            time: { blockNumber: log.event.blockNumber },
            reason: 'reason' in args ? args.reason : undefined,
            proposalId: args.proposalId.toString(),
            txHash: log.event.transactionHash
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Convert a NounsBuilder proposal event into our interop model
 */
const mapProposalEvent = (log) => {
    let state;
    switch (log.parsed.name) {
        case 'ProposalExecuted':
            state = 'executed';
            break;
        case 'ProposalQueued':
            state = 'queued';
            break;
        case 'ProposalCanceled':
            state = 'canceled';
            break;
        case 'ProposalVetoed':
            state = 'canceled';
            break;
        case 'ProposalCreated':
            state = 'pending';
            break;
        // statically exhaustive cases, do not need default case
    }
    return {
        state,
        proposalId: log.parsed.args.proposalId,
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash
    };
};
exports.mapProposalEvent = mapProposalEvent;
/**
 * Convert a NounsBuilder delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    if (log.parsed.name === 'DelegateChanged') {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: log.parsed.args.from,
            toDelegate: log.parsed.args.to,
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
            amount: log.parsed.args.newTotalVotes.toString(),
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map