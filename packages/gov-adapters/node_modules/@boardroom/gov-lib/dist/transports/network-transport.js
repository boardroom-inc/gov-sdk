"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NetworkTransportResolver = void 0;
class NetworkTransportResolver {
    constructor(instances) {
        this.instances = instances;
    }
    network(chainId) {
        const thing = this.instances[`${chainId}`];
        if (thing === undefined) {
            throw new Error(`unable to resolve dependency for network ${chainId}`);
        }
        return thing;
    }
}
exports.NetworkTransportResolver = NetworkTransportResolver;
//# sourceMappingURL=network-transport.js.map