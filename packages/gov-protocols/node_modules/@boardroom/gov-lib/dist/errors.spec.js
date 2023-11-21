"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errors_1 = require("./errors");
describe('isSDKError', () => {
    it('should return true for SDK errors', () => {
        expect((0, errors_1.isGovError)(new errors_1.GovError('Unknown'))).toEqual(true);
    });
    it('should return false for non SDK errors', () => {
        expect((0, errors_1.isGovError)(new Error())).toEqual(false);
    });
});
//# sourceMappingURL=errors.spec.js.map