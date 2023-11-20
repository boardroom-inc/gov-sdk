"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isGovError = exports.GovError = exports.errorCodes = void 0;
const ts_custom_error_1 = require("ts-custom-error");
/**
 * All valid error codes that can be thrown throught the gov framework
 */
exports.errorCodes = {
    Unknown: {
        message: 'Unknown error',
    },
    MalformedAdapterResponse: {
        message: 'The protocol adapter returned a malformed response',
    },
};
/**
 * Thrown anytime there is an error within the gov framework
 */
class GovError extends ts_custom_error_1.CustomError {
    constructor(code, data = {}) {
        super(`${code}: ${exports.errorCodes[code].message}`);
        this.isGovError = true;
        this.data = data;
        this.code = code;
    }
}
exports.GovError = GovError;
/**
 * User defined type guard to narrow out a trait error
 */
const isGovError = (err, code) => {
    const govError = err;
    if (!(govError === null || govError === void 0 ? void 0 : govError.isGovError)) {
        return false;
    }
    // if no specific code provide, we're good
    if (code === undefined) {
        return true;
    }
    // else code must match
    return govError.code === code;
};
exports.isGovError = isGovError;
//# sourceMappingURL=errors.js.map