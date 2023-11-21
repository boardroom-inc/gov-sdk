"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRegistry = void 0;
const registry_1 = require("./registry");
const resolver_1 = require("./resolver");
/**
 * Create a new protocol registry by processing a stack of "registator"
 * functions that will be injected with transports and allowed to register
 * protocols
 */
const createRegistry = (frameworkConfig) => {
    const registry = new registry_1.ProtocolRegistry();
    // create a resolver for the provided transports
    const transportResolver = new resolver_1.TaggedTypeResolver();
    transportResolver.add(frameworkConfig.transports);
    // inject all registrator functions with what they need to get wired up
    const register = registry.register.bind(registry);
    const transport = transportResolver.get.bind(transportResolver);
    for (const registrator of frameworkConfig.registrators) {
        registrator(register, transport, frameworkConfig.snapshotApiKey, frameworkConfig.boardroomAPIKey, frameworkConfig.etherscanMainnetAPIKey, frameworkConfig.etherscanOptimismAPIKey);
    }
    return registry;
};
exports.createRegistry = createRegistry;
//# sourceMappingURL=framework.js.map