"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protocol = void 0;
/**
 * The client-side protocol abstraction
 */
class Protocol {
    constructor(
    /** the canonical identifier used to reference a protocol */
    cname, 
    /** the display name of this protocol */
    name, 
    /** the set of implemented resolvers for this protocol */
    _adapters, metaDataOptions) {
        this.cname = cname;
        this.name = name;
        this._adapters = _adapters;
        this.metaDataOptions = metaDataOptions;
    }
    /**
     * Resolve a speicifc adapter for this protocols. Throws if not implemented
     */
    adapter(tag, instance) {
        return this._adapters.get(tag, instance);
    }
    /**
     * Return an array of instance names for a specific adapter
     */
    adapterInstances(tag) {
        return this._adapters.getInstances(tag);
    }
    /**
     * Returns true if this protocol implements a specific adapter
     */
    hasAdapter(tag, instance) {
        return this._adapters.has(tag, instance);
    }
    /**
     * Get all implemented adapters for this protocol
     */
    getAdapters() {
        const tags = this._adapters.getTags();
        return tags.map((t) => ({ adapter: t.tag, instance: t.instance }));
    }
}
exports.Protocol = Protocol;
//# sourceMappingURL=protocol.js.map