"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProposalAdapterValidators = exports.ProposalTimeFormat = exports.CreateProposalRequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const common_1 = require("./common");
const adapter_validator_1 = require("../adapter-validator");
exports.CreateProposalRequestId = typebox_1.Type.String();
exports.ProposalTimeFormat = typebox_1.Type.Union([typebox_1.Type.Literal('blockNumber'), typebox_1.Type.Literal('timestamp')]);
exports.createProposalAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    createProposal: (0, adapter_validator_1.compileAdapterValidator)(exports.CreateProposalRequestId),
    getCanonicalProposalTimeFormat: (0, adapter_validator_1.compileAdapterValidator)(exports.ProposalTimeFormat),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
};
//# sourceMappingURL=create-proposal.js.map