"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdapterRegistry = void 0;
const adapters_1 = require("./adapters");
const validation_1 = require("./validation");
/**
 * A wrapper around a tagged type resolver for Adapters that can be passed to
 * registrating function in order to setup adapters for protocol
 * implementations
 */
class AdapterRegistry {
    constructor(resolver) {
        this.resolver = resolver;
    }
    /**
     * Register an adapter implementation
     */
    implement(tag, implementation, instance) {
        // having to manually cast here since theres no way to statically express
        // that the implementation and adapters have the same "key space", we are
        // really just narrowing out of the union of all response validators here
        const responseValidator = adapters_1.validators[tag];
        const wrapped = (0, validation_1.decorateWithValidators)(implementation, responseValidator);
        this.resolver.set(tag, wrapped, instance);
    }
}
exports.AdapterRegistry = AdapterRegistry;
//# sourceMappingURL=adapter-registry.js.map