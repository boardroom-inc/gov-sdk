"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HttpTransport = void 0;
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const lru_cache_1 = __importDefault(require("lru-cache"));
const p_queue_1 = __importDefault(require("p-queue"));
const defaultOptions = () => {
    return { maxConcurrency: 1 };
};
/**
 * Basic HTTP transport
 */
class HttpTransport {
    constructor(options = {}) {
        this.cache = new lru_cache_1.default({ max: 5000, maxAge: 0 });
        /**
         * Directly invoke fetch
         *
         * Bound to the class instance (can be used as a standalone function)
         *
         * Exposing this on the transport to facilitate testability and to ensure
         * fetches are limited by the http parallelism set on the transport
         */
        this.fetch = (...args) => {
            return this.queue.add(() => (0, cross_fetch_1.default)(...args));
        };
        const opts = { ...defaultOptions(), ...options };
        this.queue = new p_queue_1.default({ concurrency: opts.maxConcurrency });
    }
    /**
     * Fetch JSON from a remote URL
     */
    async getJson(url, maxStaleAgeInSeconds = 0) {
        return this.queue.add(() => this._getJson(url, maxStaleAgeInSeconds));
    }
    async _getJson(url, maxStaleAgeInSeconds) {
        const existing = this.cache.get(url);
        if (existing) {
            return existing;
        }
        const populate = async () => {
            const response = await (0, cross_fetch_1.default)(url);
            const data = await response.json();
            const entry = { response, data };
            return entry;
        };
        // create a closure to synchronously create the promise to avoid race
        // conditions on rapid calls with a cold cache
        const promise = populate();
        this.cache.set(url, promise, maxStaleAgeInSeconds * 1000);
        return promise;
    }
    /**
     * Post JSON to a remote URL
     */
    async postJson(url, body) {
        const response = await (0, cross_fetch_1.default)(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        const data = await response.json();
        return { response, data };
    }
}
exports.HttpTransport = HttpTransport;
//# sourceMappingURL=http.js.map