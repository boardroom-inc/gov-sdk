import fetch from 'cross-fetch';
/**
 * Similar to fetch return shape, but with JSON data pre-buffered
 */
export interface HttpResponse {
    response: Response;
    data: any;
}
/**
 * Configuration for the http transport
 */
export interface HTTPTransportOptions {
    /** max allowed concurrent HTTP requests */
    maxConcurrency: number;
}
/**
 * Basic HTTP transport
 */
export declare class HttpTransport {
    private cache;
    private queue;
    constructor(options?: Partial<HTTPTransportOptions>);
    /**
     * Directly invoke fetch
     *
     * Bound to the class instance (can be used as a standalone function)
     *
     * Exposing this on the transport to facilitate testability and to ensure
     * fetches are limited by the http parallelism set on the transport
     */
    fetch: typeof fetch;
    /**
     * Fetch JSON from a remote URL
     */
    getJson(url: string, maxStaleAgeInSeconds?: number): Promise<HttpResponse>;
    _getJson(url: string, maxStaleAgeInSeconds: number): Promise<HttpResponse>;
    /**
     * Post JSON to a remote URL
     */
    postJson(url: string, body: unknown): Promise<HttpResponse>;
}
