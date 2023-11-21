"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typebox_1 = require("@sinclair/typebox");
const validation_1 = require("./validation");
describe('compileValidator', () => {
    it('should create a validator function', () => {
        const schema = typebox_1.Type.Object({ name: typebox_1.Type.String() });
        const validator = (0, validation_1.compileValidator)(schema);
        validator({ name: 'name' }); // doesnt throw
        const task = () => validator({ name: 1 });
        expect(task).toThrow();
    });
});
describe('decorateWithValidators', () => {
    const validators = {
        inc: (0, validation_1.compileValidator)(typebox_1.Type.Object({ value: typebox_1.Type.Number() })),
    };
    it('should proxy the original function', async () => {
        const instance = {
            inc: async (val) => {
                return { value: val + 1 };
            },
        };
        const decorated = (0, validation_1.decorateWithValidators)(instance, validators);
        await expect(decorated.inc(5)).resolves.toEqual({ value: 6 });
    });
    it('should throw if returning a malformed response', async () => {
        const instance = {
            // @ts-expect-error returning an incorrect type
            inc: async () => {
                return { value: 'bad' };
            },
        };
        const decorated = (0, validation_1.decorateWithValidators)(instance, validators);
        await expect(decorated.inc(5)).rejects.toThrow();
    });
});
//# sourceMappingURL=validation.spec.js.map