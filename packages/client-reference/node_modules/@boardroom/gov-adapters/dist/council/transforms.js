"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapDelegationEvents = exports.mapProposalEvent = exports.mapVotes = exports.mapProposal = void 0;
const units_1 = require("@ethersproject/units");
const utils_1 = require("../utils");
/**
 * Map a ProposalCreated event into interop Proposal model
 */
const mapProposal = (event, choices, proposalsOffChainData, quorum, txHash) => {
    const { args } = event;
    const proposalId = args.proposalId.toString();
    const offChainData = proposalsOffChainData.find((proposal) => {
        return proposal.proposalId === proposalId;
    });
    const executables = (0, utils_1.makeExecutablesForProposal)({
        targets: (offChainData === null || offChainData === void 0 ? void 0 : offChainData.targets) || [],
        values: [],
        calldatas: (offChainData === null || offChainData === void 0 ? void 0 : offChainData.calldatas) || [],
    });
    const title = (offChainData === null || offChainData === void 0 ? void 0 : offChainData.title) || `Proposal ${proposalId}`;
    const content = (offChainData === null || offChainData === void 0 ? void 0 : offChainData.description) || '';
    return {
        id: proposalId,
        blockNumber: args.created.toNumber(),
        choices,
        startTime: { blockNumber: args.created.toNumber() },
        endTime: { blockNumber: args.expiration.toNumber() },
        proposer: '',
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
            choice: args.vote.castBallot,
            power: parseFloat((0, units_1.formatUnits)(args.vote.votingPower, 18)),
            time: { blockNumber: log.event.blockNumber },
            reason: '',
            proposalId: args.proposalId.toString(),
        };
    });
    return votes;
};
exports.mapVotes = mapVotes;
/**
 * Convert a Council proposal event into our interop model
 */
const mapProposalEvent = (log) => {
    let state;
    switch (log.parsed.name) {
        case 'ProposalExecuted':
            state = 'executed';
            break;
        case 'ProposalCreated':
            state = 'pending';
            break;
        // statically exhaustive cases, do not need default case
    }
    return {
        state,
        proposalId: log.parsed.args.proposalId.toString(),
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash,
    };
};
exports.mapProposalEvent = mapProposalEvent;
/**
 * Convert a Council delegation event into our interop model
 */
const mapDelegationEvents = (log) => {
    const amount = (0, units_1.formatUnits)(log.parsed.args.amount);
    const interopDelegationEvent = {
        aaveDelegationType: '',
        snapshotId: '',
        time: { blockNumber: log.event.blockNumber },
        txHash: log.event.transactionHash,
        delegator: log.parsed.args.from,
        fromDelegate: log.parsed.args.from,
        toDelegate: log.parsed.args.to,
        eventType: 'NONE',
        amount: amount,
    };
    if (parseFloat(amount) >= 0) {
        interopDelegationEvent.eventType = 'DELEGATED';
    }
    else if (parseFloat(amount) < 0) {
        interopDelegationEvent.eventType = 'MOVED';
    }
    return interopDelegationEvent;
};
exports.mapDelegationEvents = mapDelegationEvents;
//# sourceMappingURL=transforms.js.map