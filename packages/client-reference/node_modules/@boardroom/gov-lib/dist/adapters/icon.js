"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.iconAdapterValidators = exports.IconInfo = exports.Icon = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
exports.Icon = typebox_1.Type.Object({
    size: typebox_1.Type.String(),
    url: typebox_1.Type.String(),
});
exports.IconInfo = typebox_1.Type.Object({
    icons: typebox_1.Type.Array(exports.Icon),
});
exports.iconAdapterValidators = {
    getIcons: (0, adapter_validator_1.compileAdapterValidator)(exports.IconInfo),
};
//# sourceMappingURL=icon.js.map