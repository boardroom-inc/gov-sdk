"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAdapterValidators = exports.TokenInfo = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.TokenInfo = typebox_1.Type.Object({
    symbol: typebox_1.Type.String(),
    contractAddress: common_1.ContractAddress,
    currentMarketPrice: common_1.CurrencyAmount,
    circulatingSupply: typebox_1.Type.Optional(typebox_1.Type.Number()),
    totalSupply: typebox_1.Type.Optional(typebox_1.Type.Number()),
    maxSupply: typebox_1.Type.Optional(typebox_1.Type.Number()),
});
exports.tokenAdapterValidators = {
    getInfo: (0, adapter_validator_1.compileAdapterValidator)(exports.TokenInfo),
};
//# sourceMappingURL=token-info.js.map