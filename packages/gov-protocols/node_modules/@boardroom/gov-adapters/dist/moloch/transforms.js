"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvents = exports.mapVotes = exports.mapProposal = exports.extractTitle = void 0;
const units_1 = require("@ethersproject/units");
var MolochProposalState;
(function (MolochProposalState) {
    MolochProposalState[MolochProposalState["Pending"] = 0] = "Pending";
    MolochProposalState[MolochProposalState["Active"] = 1] = "Active";
    MolochProposalState[MolochProposalState["Canceled"] = 2] = "Canceled";
    MolochProposalState[MolochProposalState["Defeated"] = 3] = "Defeated";
    MolochProposalState[MolochProposalState["Succeeded"] = 4] = "Succeeded";
    MolochProposalState[MolochProposalState["Queued"] = 5] = "Queued";
    MolochProposalState[MolochProposalState["Expired"] = 6] = "Expired";
    MolochProposalState[MolochProposalState["Executed"] = 7] = "Executed";
})(MolochProposalState || (MolochProposalState = {}));
/**
 * Given some markdown-ish payload, extract the title and content
 */
const extractTitle = (description, defaultTitle) => {
    var _a, _b;
    try {
        const parsed = JSON.parse(description);
        return { title: (_a = parsed.title) !== null && _a !== void 0 ? _a : defaultTitle, content: (_b = parsed.description) !== null && _b !== void 0 ? _b : description };
    }
    catch (err) {
        return { title: defaultTitle, content: description };
    }
};
exports.extractTitle = extractTitle;
/**
 * Map a Moloch SubmitProposal event into a governance Proposal model
 */
const mapProposal = (event, choices, blockNumber, summoningTime, periodDuration, votingPeriodLength, startingPeriod, txHash) => {
    const shortenedDescription = event.args.details.slice(0, 30);
    const { title, content } = (0, exports.extractTitle)(event.args.details, `Proposal ${shortenedDescription}`);
    const { args } = event;
    const startTimestamp = summoningTime + parseInt(startingPeriod) * periodDuration;
    const endTimestamp = summoningTime + parseInt(startingPeriod) * periodDuration + votingPeriodLength * periodDuration;
    return {
        id: args.proposalId.toString(),
        blockNumber: blockNumber,
        choices,
        startTime: { timestamp: startTimestamp },
        endTime: { timestamp: endTimestamp },
        proposer: args.applicant,
        title: title,
        content: content,
        txHash,
    };
};
exports.mapProposal = mapProposal;
/**
 * Convert voting event logs into interop Votes
 */
const mapVotes = (logs, powerMap) => {
    const votes = logs.map((log, i) => {
        const { args } = log.parsed;
        return {
            address: args.memberAddress,
            choice: args.uintVote,
            power: parseFloat((0, units_1.formatUnits)(powerMap[i], 0)),
            time: { blockNumber: log.event.blockNumber },
            reason: undefined,
            proposalId: args.proposalId.toString(),
            txHash: log.event.transactionHash
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Convert a moloch proposal event into our interop model
 */
const mapProposalEvents = (log) => {
    let state;
    switch (log.parsed.name) {
        case 'CancelProposal':
            state = 'canceled';
            break;
        case 'ProcessProposal':
            state = 'executed';
            break;
        case 'SponsorProposal':
            state = 'pending';
            break;
        case 'SubmitProposal':
            state = 'pending';
            break;
        // statically exhaustive cases, do not need default case
    }
    return {
        state,
        proposalId: log.parsed.args.proposalId.toString(),
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash
    };
};
exports.mapProposalEvents = mapProposalEvents;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    return {
        delegator: log.parsed.args.memberAddress,
        fromDelegate: '',
        toDelegate: log.parsed.args.newDelegateKey,
        amount: '',
        aaveDelegationType: '',
        snapshotId: '',
        eventType: 'DELEGATED',
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash,
    };
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map