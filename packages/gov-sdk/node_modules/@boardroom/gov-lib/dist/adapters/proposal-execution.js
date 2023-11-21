"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proposalExecutionAdapterValidators = exports.TimeDelay = exports.RequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
exports.RequestId = typebox_1.Type.String();
exports.TimeDelay = typebox_1.Type.Number();
exports.proposalExecutionAdapterValidators = {
    queueProposal: (0, adapter_validator_1.compileAdapterValidator)(exports.RequestId),
    executeProposal: (0, adapter_validator_1.compileAdapterValidator)(exports.RequestId),
    cancelProposal: (0, adapter_validator_1.compileAdapterValidator)(exports.RequestId),
    getTimeDelay: (0, adapter_validator_1.compileAdapterValidator)(exports.TimeDelay),
};
//# sourceMappingURL=proposal-execution.js.map