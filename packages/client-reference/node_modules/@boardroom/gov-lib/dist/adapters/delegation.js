"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delegationAdapterValidators = exports.TokenAddress = exports.DelegateAddress = exports.DelegationsInfo = exports.DelegationEventPage = exports.DelegationEvent = exports.EventType = exports.DelegateVotingPowerRequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.DelegateVotingPowerRequestId = typebox_1.Type.String();
exports.EventType = typebox_1.Type.Union([
    typebox_1.Type.Literal('DELEGATED'),
    typebox_1.Type.Literal('UNDELEGATED'),
    typebox_1.Type.Literal('MOVED'),
    typebox_1.Type.Literal('VOTING_POWER'),
    typebox_1.Type.Literal('PROPOSITION_POWER'),
    typebox_1.Type.Literal('NONE'),
]);
exports.DelegationEvent = typebox_1.Type.Object({
    delegator: typebox_1.Type.String(),
    fromDelegate: typebox_1.Type.String(),
    toDelegate: typebox_1.Type.String(),
    amount: typebox_1.Type.String(),
    aaveDelegationType: typebox_1.Type.String(),
    snapshotId: typebox_1.Type.String(),
    eventType: exports.EventType,
    time: common_1.Time,
    txHash: typebox_1.Type.String(),
});
exports.DelegationEventPage = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.DelegationEvent),
    nextCursor: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.DelegationsInfo = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    addressDelegatedTo: typebox_1.Type.String(),
});
exports.DelegateAddress = typebox_1.Type.String();
exports.TokenAddress = typebox_1.Type.String();
exports.delegationAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    delegateVotingPower: (0, adapter_validator_1.compileAdapterValidator)(exports.DelegateVotingPowerRequestId),
    getDelegationEvents: (0, adapter_validator_1.compileAdapterValidator)(exports.DelegationEventPage),
    getDelegation: (0, adapter_validator_1.compileAdapterValidator)(exports.DelegateAddress),
    getDelegations: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.Array(exports.DelegationsInfo)),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
    getTokenAddress: (0, adapter_validator_1.compileAdapterValidator)(exports.TokenAddress),
    getDelegationFunctionsSelectors: (0, adapter_validator_1.compileAdapterValidator)(common_1.FunctionsSelectors),
    getDelegationContractAddress: (0, adapter_validator_1.compileAdapterValidator)(common_1.Address),
};
//# sourceMappingURL=delegation.js.map