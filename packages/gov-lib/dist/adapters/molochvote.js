"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteAdapterValidators = exports.CastVoteRequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.CastVoteRequestId = typebox_1.Type.String();
exports.voteAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    submitVote: (0, adapter_validator_1.compileAdapterValidator)(exports.CastVoteRequestId),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
};
//# sourceMappingURL=molochvote.js.map