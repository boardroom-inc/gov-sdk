"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.votePowerAdapterValidators = exports.WalletMapInfo = exports.BalanceInfo = exports.VotePowerInfo = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.VotePowerInfo = typebox_1.Type.Object({
    protocol: typebox_1.Type.String(),
    address: typebox_1.Type.String(),
    power: typebox_1.Type.Number(),
});
exports.BalanceInfo = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    balance: typebox_1.Type.Number(),
});
exports.WalletMapInfo = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    wallet: typebox_1.Type.String(),
});
exports.votePowerAdapterValidators = {
    getFramework: (0, adapter_validator_1.compileAdapterValidator)(common_1.Framework),
    getVotePower: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.Array(exports.VotePowerInfo)),
    getDelegatableVotePower: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.Array(exports.VotePowerInfo)),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
    getBalance: (0, adapter_validator_1.compileAdapterValidator)(typebox_1.Type.Array(exports.BalanceInfo)),
};
//# sourceMappingURL=vote-power.js.map