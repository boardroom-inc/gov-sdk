"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voteAdapterValidators = exports.CastVoteEncodedResponse = exports.CastVoteRequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.CastVoteRequestId = typebox_1.Type.String();
exports.CastVoteEncodedResponse = typebox_1.Type.Object({
    encodedData: typebox_1.Type.String(),
    toContractAddress: typebox_1.Type.String(),
});
exports.voteAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    castVote: (0, adapter_validator_1.compileAdapterValidator)(exports.CastVoteRequestId),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
    getVotingFunctionsSelectors: (0, adapter_validator_1.compileAdapterValidator)(common_1.VoteFunctionsSelectors),
    getVotingContractAddress: (0, adapter_validator_1.compileAdapterValidator)(common_1.Address),
    getEncodedCastVoteData: (0, adapter_validator_1.compileAdapterValidator)(exports.CastVoteEncodedResponse),
};
//# sourceMappingURL=vote.js.map