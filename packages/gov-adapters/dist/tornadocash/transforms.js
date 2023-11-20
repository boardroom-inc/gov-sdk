"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvents = exports.mapVotes = exports.mapProposal = void 0;
const units_1 = require("@ethersproject/units");
var TornadoCashProposalState;
(function (TornadoCashProposalState) {
    TornadoCashProposalState[TornadoCashProposalState["Pending"] = 0] = "Pending";
    TornadoCashProposalState[TornadoCashProposalState["Active"] = 1] = "Active";
    TornadoCashProposalState[TornadoCashProposalState["Defeated"] = 2] = "Defeated";
    TornadoCashProposalState[TornadoCashProposalState["Timelocked"] = 3] = "Timelocked";
    TornadoCashProposalState[TornadoCashProposalState["AwaitingExecution"] = 4] = "AwaitingExecution";
    TornadoCashProposalState[TornadoCashProposalState["Executed"] = 5] = "Executed";
    TornadoCashProposalState[TornadoCashProposalState["Expired"] = 6] = "Expired";
})(TornadoCashProposalState || (TornadoCashProposalState = {}));
/**
 * Map a compound ProposalCreated event into a governance Proposal model
 */
const mapProposal = (event, choices, blockNumber, txHash) => {
    const { args } = event;
    let title = '';
    let description = '';
    try {
        const parsedDescription = JSON.parse(args.description);
        title = parsedDescription.title;
        description = parsedDescription.description;
    }
    catch (err) {
        title = `Proposal ${args.id}`;
    }
    return {
        id: args.id.toString(),
        blockNumber: blockNumber,
        choices,
        startTime: { timestamp: args.startTime.toNumber() },
        endTime: { timestamp: args.endTime.toNumber() },
        proposer: args.proposer,
        title: title,
        content: description,
        txHash
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
            choice: args.support ? 1 : 0,
            power: parseFloat((0, units_1.formatUnits)(args.votes, 18)),
            time: { blockNumber: log.event.blockNumber },
            proposalId: args.proposalId.toString(),
            txHash: log.event.transactionHash
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Map Tornado Cash proposal states to boardroom event formats
 */
const mapProposalEvents = (items, proposals) => {
    const results = [];
    let i = 0;
    for (const proposal of proposals.items) {
        let state;
        switch (TornadoCashProposalState[items[i]]) {
            case 'Executed':
                state = 'executed';
                break;
            case 'Pending':
                state = 'pending';
                break;
            case 'Active':
                state = 'active';
                break;
            case 'Defeated':
            case 'Expired':
                state = 'closed';
                break;
            case 'AwaitingExecution':
            case 'Timelocked':
                state = 'queued';
                break;
            default:
                state = 'active';
        }
        results.push({
            state: state,
            proposalId: proposal.id,
            time: proposal.endTime,
            txHash: proposal.txHash ? proposal.txHash : ''
        });
        i++;
    }
    return results;
};
exports.mapProposalEvents = mapProposalEvents;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    if (log.parsed.name === 'Delegated') {
        return {
            delegator: log.parsed.args.account,
            fromDelegate: '',
            toDelegate: log.parsed.args.to,
            amount: '',
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
    else {
        return {
            delegator: log.event.address,
            fromDelegate: log.parsed.args.from,
            toDelegate: '',
            amount: '',
            aaveDelegationType: '',
            snapshotId: '',
            eventType: 'UNDELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map