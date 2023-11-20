import fetch from 'cross-fetch';
import LRUCache from 'lru-cache';
import PQueue from 'p-queue';

/**
 * Similar to fetch return shape, but with JSON data pre-buffered
 */
export interface HttpResponse {
  response: Response;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any;
}

/**
 * Configuration for the http transport
 */
export interface HTTPTransportOptions {
  /** max allowed concurrent HTTP requests */
  maxConcurrency: number;
}

const defaultOptions = (): HTTPTransportOptions => {
  return { maxConcurrency: 1 };
};

/**
 * Basic HTTP transport
 */
export class HttpTransport {
  private cache = new LRUCache<string, Promise<HttpResponse>>({ max: 5000, maxAge: 0 });
  private queue: PQueue;

  constructor(options: Partial<HTTPTransportOptions> = {}) {
    const opts = { ...defaultOptions(), ...options };

    this.queue = new PQueue({ concurrency: opts.maxConcurrency });
  }

  /**
   * Directly invoke fetch
   *
   * Bound to the class instance (can be used as a standalone function)
   *
   * Exposing this on the transport to facilitate testability and to ensure
   * fetches are limited by the http parallelism set on the transport
   */
  fetch: typeof fetch = (...args) => {
    return this.queue.add(() => fetch(...args));
  };

  /**
   * Fetch JSON from a remote URL
   */
  async getJson(url: string, maxStaleAgeInSeconds = 0): Promise<HttpResponse> {
    return this.queue.add(() => this._getJson(url, maxStaleAgeInSeconds));
  }

  async _getJson(url: string, maxStaleAgeInSeconds: number): Promise<HttpResponse> {
    const existing = this.cache.get(url);
    if (existing) {
      return existing;
    }

    const populate = async () => {
      const response = await fetch(url);
      const data = await response.json();
      const entry: HttpResponse = { response, data };
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
  async postJson(url: string, body: unknown): Promise<HttpResponse> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return { response, data } as HttpResponse;
  }
}
