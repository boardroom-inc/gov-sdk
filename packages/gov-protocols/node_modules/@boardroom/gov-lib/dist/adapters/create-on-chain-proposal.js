"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnChainProposalAdapterValidators = exports.EncodedCallData = exports.ContractFunctions = exports.CreateOnChainProposalRequestId = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.CreateOnChainProposalRequestId = typebox_1.Type.String();
exports.ContractFunctions = typebox_1.Type.String();
exports.EncodedCallData = typebox_1.Type.String();
exports.createOnChainProposalAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    createOnChainProposal: (0, adapter_validator_1.compileAdapterValidator)(exports.CreateOnChainProposalRequestId),
    getContractFunctions: (0, adapter_validator_1.compileAdapterValidator)(exports.ContractFunctions),
    encodeCalldata: (0, adapter_validator_1.compileAdapterValidator)(exports.EncodedCallData),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
};
//# sourceMappingURL=create-on-chain-proposal.js.map