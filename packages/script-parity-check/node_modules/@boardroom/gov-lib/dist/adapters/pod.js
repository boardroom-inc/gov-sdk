"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.podAdapterValidators = exports.PodList = exports.PodInfo = void 0;
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("../adapter-validator");
const common_1 = require("./common");
exports.PodInfo = typebox_1.Type.Object({
    address: typebox_1.Type.String(),
    ensName: typebox_1.Type.String(),
    adminAddress: typebox_1.Type.String(),
    membersList: typebox_1.Type.Array(typebox_1.Type.String()),
    imageUrl: typebox_1.Type.String(),
});
exports.PodList = typebox_1.Type.Object({
    podList: typebox_1.Type.Array(exports.PodInfo),
});
exports.podAdapterValidators = {
    getPods: (0, adapter_validator_1.compileAdapterValidator)(exports.PodList),
    getChainId: (0, adapter_validator_1.compileAdapterValidator)(common_1.ChainId),
};
//# sourceMappingURL=pod.js.map