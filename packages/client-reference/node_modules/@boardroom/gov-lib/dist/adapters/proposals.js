"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalsAdapterValidators = exports.VotePage = exports.Vote = exports.ProposalPage = exports.Proposal = exports.ProposalEventPage = exports.ProposalEvent = exports.ProposalState = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.ProposalState = typebox_1.Type.Union([
    typebox_1.Type.Literal('pending'),
    typebox_1.Type.Literal('active'),
    typebox_1.Type.Literal('closed'),
    typebox_1.Type.Literal('canceled'),
    typebox_1.Type.Literal('queued'),
    typebox_1.Type.Literal('executed'),
]);
exports.ProposalEvent = typebox_1.Type.Object({
    proposalId: typebox_1.Type.String(),
    state: exports.ProposalState,
    time: common_1.Time,
    txHash: typebox_1.Type.String(),
});
exports.ProposalEventPage = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.ProposalEvent),
    nextCursor: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.Proposal = typebox_1.Type.Object({
    id: typebox_1.Type.String(),
    title: typebox_1.Type.String(),
    proposer: typebox_1.Type.String(),
    externalUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    content: typebox_1.Type.String(),
    choices: typebox_1.Type.Array(typebox_1.Type.String()),
    blockNumber: typebox_1.Type.Number(),
    startTime: common_1.Time,
    endTime: common_1.Time,
    type: typebox_1.Type.Optional(typebox_1.Type.String()),
    scores: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
        choice: typebox_1.Type.String(),
        total: typebox_1.Type.String(),
    }))),
    status: typebox_1.Type.Optional(typebox_1.Type.String()),
    summary: typebox_1.Type.Optional(typebox_1.Type.String()),
    privacy: typebox_1.Type.Optional(typebox_1.Type.String()),
    executables: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.Object({
        target: typebox_1.Type.String(),
        signature: typebox_1.Type.Optional(typebox_1.Type.String()),
        calldata: typebox_1.Type.String(),
        value: typebox_1.Type.Optional(typebox_1.Type.Number()),
        params: typebox_1.Type.Optional(typebox_1.Type.Record(typebox_1.Type.String(), typebox_1.Type.String())),
    }))),
    quorum: typebox_1.Type.Optional(typebox_1.Type.Integer()),
    txHash: typebox_1.Type.Optional(typebox_1.Type.String()),
    executionArgs: typebox_1.Type.Optional(typebox_1.Type.Object({
        targets: typebox_1.Type.Array(typebox_1.Type.String()),
        values: typebox_1.Type.Array(typebox_1.Type.Optional(typebox_1.Type.String())),
        signatures: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
        calldatas: typebox_1.Type.Array(typebox_1.Type.String()),
        description: typebox_1.Type.String(),
    })),
    votingModule: typebox_1.Type.Optional(typebox_1.Type.String()),
    flagged: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
});
exports.ProposalPage = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.Proposal),
    nextCursor: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.Vote = typebox_1.Type.Object({
    time: common_1.Time,
    proposalId: typebox_1.Type.String(),
    address: typebox_1.Type.String(),
    choice: typebox_1.Type.Optional(typebox_1.Type.Union([
        typebox_1.Type.Integer(),
        typebox_1.Type.Array(typebox_1.Type.Number()),
        typebox_1.Type.Record(typebox_1.Type.Number(), typebox_1.Type.Number()),
    ])),
    power: typebox_1.Type.Number(),
    reason: typebox_1.Type.Optional(typebox_1.Type.String()),
    privacy: typebox_1.Type.Optional(typebox_1.Type.String()),
    txHash: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.VotePage = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.Vote),
    nextCursor: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.proposalsAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    getProposals: (0, adapter_validator_1.compileAdapterValidator)(exports.ProposalPage),
    getProposalEvents: (0, adapter_validator_1.compileAdapterValidator)(exports.ProposalEventPage),
    getVotes: (0, adapter_validator_1.compileAdapterValidator)(exports.VotePage),
    getExternalLink: (0, adapter_validator_1.compileAdapterValidator)(common_1.ExternalLink),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
    getProposalCreationFunctionsSelectors: (0, adapter_validator_1.compileAdapterValidator)(common_1.FunctionsSelectors),
    getProposalCreationContractAddress: (0, adapter_validator_1.compileAdapterValidator)(common_1.Address),
    getSnapshotSpaceName: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.String()),
    getProposalFromEvent: (0, adapter_validator_1.compileAdapterValidator)(exports.Proposal),
    getProposalIdFromEvent: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.String()),
    getVoteFromEvent: (0, adapter_validator_1.compileAdapterValidator)(exports.Vote),
};
//# sourceMappingURL=proposals.js.map