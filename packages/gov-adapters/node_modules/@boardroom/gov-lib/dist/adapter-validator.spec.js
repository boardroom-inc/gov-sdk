"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const adapter_validator_1 = require("./adapter-validator");
const errors_1 = require("./errors");
describe('compileAdapterValidator', () => {
    it('should compile a validator that throws a MalformedAdapterResponse GovError', () => {
        const schema = typebox_1.Type.Object({ name: typebox_1.Type.String() });
        const validator = (0, adapter_validator_1.compileAdapterValidator)(schema);
        const task = () => validator({ name: 1 });
        expect(task).toThrow(/MalformedAdapterResponse/);
    });
});
describe('recoverValidationErrors', () => {
    it('should extract validation errors', () => {
        const schema = typebox_1.Type.Object({ name: typebox_1.Type.String() });
        const validator = (0, adapter_validator_1.compileAdapterValidator)(schema);
        try {
            validator({ name: 1 });
        }
        catch (err) {
            if ((0, errors_1.isGovError)(err, 'MalformedAdapterResponse')) {
                const errors = (0, adapter_validator_1.recoverValidationErrors)(err);
                expect(errors).toEqual([expect.objectContaining({ message: 'must be string' })]);
            }
        }
    });
});
//# sourceMappingURL=adapter-validator.spec.js.map