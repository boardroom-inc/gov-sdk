"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.treasuryAdapterValidators = void 0;
const common_1 = require("./common");
const adapter_validator_1 = require("../adapter-validator");
exports.treasuryAdapterValidators = {
    getTreasuryAddresses: (0, adapter_validator_1.compileAdapterValidator)(common_1.Addresses),
    getBalance: (0, adapter_validator_1.compileAdapterValidator)(common_1.CurrencyAmount),
    getTransactions: (0, adapter_validator_1.compileAdapterValidator)(common_1.TransactionsResponse),
    getTransfers: (0, adapter_validator_1.compileAdapterValidator)(common_1.TransfersResponse),
    getTokenBalances: (0, adapter_validator_1.compileAdapterValidator)(common_1.CurrencyTokenBalancesInfo),
};
//# sourceMappingURL=treasury.js.map