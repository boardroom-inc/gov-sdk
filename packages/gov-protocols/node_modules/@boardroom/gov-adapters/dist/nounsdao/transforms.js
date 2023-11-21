"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvent = exports.mapVotes = exports.mapProposal = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
const utils_1 = require("../utils");
var NounsDAOProposalState;
(function (NounsDAOProposalState) {
    NounsDAOProposalState[NounsDAOProposalState["Pending"] = 0] = "Pending";
    NounsDAOProposalState[NounsDAOProposalState["Active"] = 1] = "Active";
    NounsDAOProposalState[NounsDAOProposalState["Canceled"] = 2] = "Canceled";
    NounsDAOProposalState[NounsDAOProposalState["Defeated"] = 3] = "Defeated";
    NounsDAOProposalState[NounsDAOProposalState["Succeeded"] = 4] = "Succeeded";
    NounsDAOProposalState[NounsDAOProposalState["Queued"] = 5] = "Queued";
    NounsDAOProposalState[NounsDAOProposalState["Expired"] = 6] = "Expired";
    NounsDAOProposalState[NounsDAOProposalState["Executed"] = 7] = "Executed";
    NounsDAOProposalState[NounsDAOProposalState["Vetoed"] = 8] = "Vetoed";
})(NounsDAOProposalState || (NounsDAOProposalState = {}));
/**
 * Given some markdown-ish payload, extract the title and content
 */
const extractTitle = (description, defaultTitle) => {
    // descriptions seem to start with a markdown header always
    const match = description.match(/^\s*(.*)\n\s*([\S\s]*)$/);
    if (!match) {
        return { title: defaultTitle, content: description };
    }
    const [, header, content] = match;
    const title = header.replace(/^\s*#\s*/, ''); // remove header
    return { title, content };
};
exports.extractTitle = extractTitle;
/**
 * Map a nounsdao ProposalCreated event into a governance Proposal model
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
const mapVotes = (logs) => {
    const votes = logs.map((log) => {
        const { args } = log.parsed;
        return {
            address: args.voter,
            choice: args.support,
            // TODO: this should probably be something that is configurable on the
            // adapter level, but defaults to 18.
            // For nounsdao this is 0 because the vote power is already base 10
            power: parseFloat((0, units_1.formatUnits)(args.votes, 0)),
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
 * Map NounsDAO proposal states to boardroom event formats
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
            amount: log.parsed.args.newBalance.toString(),
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