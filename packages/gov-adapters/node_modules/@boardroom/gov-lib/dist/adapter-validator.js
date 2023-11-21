"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverValidationErrors = exports.compileAdapterValidator = void 0;
const errors_1 = require("./errors");
const validation_1 = require("./validation");
/**
 * Same as compileValidator, but will throw a MalformedAdapterResponse GovError
 * on validation errors
 */
const compileAdapterValidator = (schema) => (0, validation_1.compileValidator)(schema, (errors) => new errors_1.GovError('MalformedAdapterResponse', { errors }));
exports.compileAdapterValidator = compileAdapterValidator;
/**
 * Given a MalformedAdapterResponse GovError, recover the specific validation
 * errors that happened with the payload
 */
const recoverValidationErrors = (error) => {
    const { data } = error;
    return data.errors;
};
exports.recoverValidationErrors = recoverValidationErrors;
//# sourceMappingURL=adapter-validator.js.map