"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvents = exports.mapVotes = exports.mapProposal = void 0;
const units_1 = require("@ethersproject/units");
const utils_1 = require("../utils");
var DelegationType;
(function (DelegationType) {
    DelegationType[DelegationType["VOTING_POWER"] = 0] = "VOTING_POWER";
    DelegationType[DelegationType["PROPOSITION_POWER"] = 1] = "PROPOSITION_POWER";
})(DelegationType || (DelegationType = {}));
/**
 * Map an aave ProposalCreated event into an interop Proposal model
 */
const mapProposal = (event, content, quorum, txHash) => {
    var _a;
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
        // aave's language
        choices: ['NAY', 'YAE'],
        startTime: { blockNumber: args.startBlock.toNumber() },
        endTime: { blockNumber: args.endBlock.toNumber() },
        content: content.description,
        proposer: args.creator,
        // aave proposal 20 has a malformed IPFS payload with a missing title, and
        // we cant leave this undefined, so if its not present create a placeholder
        // title
        title: (_a = content.title) !== null && _a !== void 0 ? _a : `Proposal ${args.id.toString()}`,
        executables,
        quorum,
        txHash,
    };
};
exports.mapProposal = mapProposal;
/**
 * Convert an aave vote event into our interop vote model
 */
const mapVotes = (logs) => {
    const votes = logs.map((log) => {
        return {
            address: log.parsed.args.voter,
            choice: log.parsed.args.support ? 1 : 0,
            power: parseFloat((0, units_1.formatUnits)(log.parsed.args.votingPower, 18)),
            time: { blockNumber: log.event.blockNumber },
            proposalId: log.parsed.args.id.toString(),
            txHash: log.event.transactionHash,
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Convert an aave proposal event into our interop event model
 */
const mapProposalEvents = (logs) => {
    const events = logs.map((log) => {
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
    });
    return events;
};
exports.mapProposalEvents = mapProposalEvents;
/**
 * Convert a compound delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    if (log.parsed.name === 'DelegateChanged') {
        return {
            delegator: log.parsed.args.delegator,
            fromDelegate: '',
            toDelegate: log.parsed.args.delegatee,
            amount: '',
            aaveDelegationType: DelegationType[log.parsed.args.delegationType].toString(),
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
            toDelegate: log.parsed.args.user,
            amount: (0, units_1.formatUnits)(log.parsed.args.amount, 18),
            aaveDelegationType: DelegationType[log.parsed.args.delegationType].toString(),
            snapshotId: '',
            eventType: 'DELEGATED',
            time: { blockNumber: log.event.blockNumber },
            txHash: log.event.transactionHash,
        };
    }
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map