"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generalAdapterValidators = exports.TransferEventPage = exports.TransferEvent = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
exports.TransferEvent = typebox_1.Type.Object({
    from: typebox_1.Type.String(),
    to: typebox_1.Type.String(),
    value: typebox_1.Type.String(),
    txHash: typebox_1.Type.String(),
});
exports.TransferEventPage = typebox_1.Type.Object({
    items: typebox_1.Type.Array(exports.TransferEvent),
    nextCursor: typebox_1.Type.Optional(typebox_1.Type.String()),
});
exports.generalAdapterValidators = {
    getTransferEvents: (0, adapter_validator_1.compileAdapterValidator)(exports.TransferEventPage),
};
//# sourceMappingURL=general.js.map