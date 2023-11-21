"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stakingAdapterValidators = exports.Allowance = exports.TransactionHash = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.TransactionHash = typebox_1.Type.String();
exports.Allowance = typebox_1.Type.String();
exports.stakingAdapterValidators = {
    getAllowance: (0, adapter_validator_1.compileAdapterValidator)(exports.Allowance),
    approve: (0, adapter_validator_1.compileAdapterValidator)(exports.TransactionHash),
    stake: (0, adapter_validator_1.compileAdapterValidator)(exports.TransactionHash),
    unStake: (0, adapter_validator_1.compileAdapterValidator)(exports.TransactionHash),
    getStakedTokenBalance: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.String()),
    getTokenBalance: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.String()),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
};
//# sourceMappingURL=staking-token.js.map