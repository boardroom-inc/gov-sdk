"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorateWithValidators = exports.compileValidator = void 0;
const ajv_1 = __importDefault(require("ajv"));
// ajv instance is stateful, caching the compiled schema validator functions
// keyed by the schemas themselves, so instantiating in the global context
// allows us to benefit from the memoization
const ajv = new ajv_1.default()
    // accomodations for typebox, see:
    //   https://github.com/sinclairzx81/typebox#validation
    .addKeyword('kind')
    .addKeyword('modifier');
const defaultErrorFactory = () => new Error();
/**
 * Given a JSON schema, create a function that will throw if the provided data
 * does not match the spec
 */
const compileValidator = (schema, errorFactory = defaultErrorFactory) => {
    const compiled = ajv.compile(schema);
    return (payload) => {
        var _a;
        if (compiled(payload)) {
            return payload;
        }
        throw errorFactory((_a = compiled.errors) !== null && _a !== void 0 ? _a : []);
    };
};
exports.compileValidator = compileValidator;
/**
 * Will **modifiy** instance to patch it such that the response is validated
 * via the provided validators
 *
 * **NOTE**: The patched functions will be hard-bound to their original context
 * and thus can be called "bare"
 */
const decorateWithValidators = (instance, validators) => {
    // hella any-s for this block, I think it'd be difficult to try and type it
    // but maybe there is a way. The main thing is that the instance and validator
    // params we know "line up" correctly to make the below code work based on
    // their types, so we're just bypassing the compiler for this monkey-patching
    // and decorating logic
    for (const key in validators) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const fn = instance[key].bind(instance);
        instance[key] = (async (...args) => {
            const resp = await fn(...args);
            validators[key](resp); // throws if invalid response
            return resp;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
        });
    }
    return instance;
};
exports.decorateWithValidators = decorateWithValidators;
//# sourceMappingURL=validation.js.map