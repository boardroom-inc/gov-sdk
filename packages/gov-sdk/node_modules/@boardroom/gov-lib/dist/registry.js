"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolRegistry = void 0;
const adapter_registry_1 = require("./adapter-registry");
const protocol_1 = require("./protocol");
const resolver_1 = require("./resolver");
/**
 * Manage registered protocols
 */
class ProtocolRegistry {
    constructor() {
        this._protocols = new Map();
    }
    /**
     * Registers a new protocol and its adpaters
     */
    register(info) {
        if (this._protocols.has(info.cname)) {
            // Check if protocol cname exists
            throw new Error();
        }
        // if the protocol implements adapters, create the new tagged type resolver
        // and pass it into the adapters function to wire up all implemented
        // adapters
        const adapters = new resolver_1.TaggedTypeResolver();
        if (info.adapters) {
            const adapterRegistry = new adapter_registry_1.AdapterRegistry(adapters);
            info.adapters(adapterRegistry);
        }
        if (!info.category) {
            info.category = ['Uncategorized'];
        }
        if (info.isEnabled === undefined) {
            info.isEnabled = true;
        }
        if (!info.type) {
            info.type = 'DAO';
        }
        if (!info.associatedAddresses) {
            info.associatedAddresses = [];
        }
        if (!info.associatedProtocols) {
            info.associatedProtocols = [];
        }
        // add it to the protocol map
        const protocol = new protocol_1.Protocol(info.cname, info.name, adapters, {
            category: info.category,
            type: info.type,
            isEnabled: info.isEnabled,
            associatedAddresses: info.associatedAddresses,
            associatedProtocols: info.associatedProtocols,
        });
        this._protocols.set(info.cname, protocol);
    }
    /**
     * Get a specific protocol by its cname, throws if not found
     */
    get(cname) {
        const protocol = this._protocols.get(cname);
        if (!protocol) {
            throw new Error();
        }
        return protocol;
    }
    /**
     * Iterate through all protocol
     */
    *all() {
        yield* this._protocols.values();
    }
}
exports.ProtocolRegistry = ProtocolRegistry;
//# sourceMappingURL=registry.js.map