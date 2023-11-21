/**
 * Buffer an async iterable into an array
 */
export declare const bufferAsyncIterable: <T>(iterable: AsyncIterableIterator<T>) => Promise<T[]>;
