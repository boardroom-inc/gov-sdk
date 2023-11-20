"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GovernanceSDK = void 0;
const gov_lib_1 = require("@boardroom/gov-lib");
const gov_protocols_1 = require("@boardroom/gov-protocols");
/**
 * The Governance SDK
 *
 * A protocol and blockchain agnostic governance interopability framework.
 */
class GovernanceSDK {
    constructor(options = {}) {
        var _a;
        // default transports
        const http = new gov_lib_1.HttpTransport();
        const ipfs = new gov_lib_1.IpfsTransport(http);
        const transports = {
            ipfs,
            http,
            ...options.transports,
        };
        this._registry = gov_lib_1.createRegistry({
            registrators: (_a = options.protocols) !== null && _a !== void 0 ? _a : gov_protocols_1.protocols,
            transports,
            snapshotApiKey: options.snapshotApiKey,
            boardroomAPIKey: options.boardroomAPIKey,
            etherscanMainnetAPIKey: options.etherscanMainnetAPIKey,
            etherscanOptimismAPIKey: options.etherscanOptimismAPIKey,
        });
        this.transports = new gov_lib_1.TaggedTypeResolver(transports);
        this.snapshotApiKey = options.snapshotApiKey;
        this.boardroomAPIKey = options.boardroomAPIKey;
        this.etherscanMainnetAPIKey = options.etherscanMainnetAPIKey;
        this.etherscanOptimismAPIKey = options.etherscanOptimismAPIKey;
    }
    /**
     * Get a protocol by its cname
     *
     * Will throw if no protocol has been registered with that cname
     */
    getProtocol(cname) {
        return this._registry.get(cname);
    }
    /**
     * Get an array of all registered protocols
     */
    getAllProtocols() {
        return [...this._registry.all()];
    }
    /**
     * Return a Time union
     *
     * Only includes blockNumber if an rpc transport was provided when
     * instantiating the SDK
     */
    async getCurrentTime(network = 1) {
        const timestamp = Date.now() / 1000;
        if (this.transports.has('rpc')) {
            const blockNumber = await this.transports.get('rpc').network(network).getBlockNumber();
            return { timestamp, blockNumber };
        }
        return { timestamp };
    }
}
exports.GovernanceSDK = GovernanceSDK;
//# sourceMappingURL=sdk.js.map