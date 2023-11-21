/**
 * Standard options to pass to a paginated adapter function
 */
export interface PaginationOptions {
    /** opaque pagination cursor */
    cursor?: string;
    /** request up to a specific number of items */
    limit?: number;
    /** request certain start and end blocks */
    startBlock?: number;
    endBlock?: number;
    proposalIds?: Array<String>;
    status?: string;
}
/**
 * Standard envelope for a paginated adapter response
 */
export interface PaginatedResponse<T> {
    items: T[];
    /** if provided, should be provided to request the next page */
    nextCursor?: string;
}
/**
 * Standard way to encode data deterministically into an opaque string.
 * NOTE: not deterministic for nested objects
 */
export declare const encodeCursor: <T = Record<string, unknown>>(item: T) => string;
/**
 * Parse a cursor encoded with encodeCursor back into a record object
 */
export declare const decodeCursor: <T = Record<string, unknown>>(cursor: string | undefined) => T | undefined;
/**
 * serialize a simple object with sorted fields
 * NOTE: not deterministic for nested objects
 */
export declare const serialize: (keys: Record<string, unknown>) => string;
/**
 * Similar to the generalized pagination format, except the instead of a cursor
 * we have the last evaluated item. the caller must then serialize the LEI into
 * a cursor
 */
interface ExtractedPage<T> {
    items: T[];
    /** if present, there are more items in the page */
    lastEvaluatedItem?: T;
}
/**
 * Given an array of T items, take up to `take` items from the first item that
 * returns true for a start condition, exclusive
 */
export declare const extractPage: <T>(items: T[], exclusiveStartCondition: (item: T) => any, take?: number) => ExtractedPage<T>;
declare type PaginatedMethodCaller<T> = (cursor: string | undefined) => Promise<PaginatedResponse<T>>;
/**
 * Given a function that takes a cursor and returns a paginated response on T,
 * create an async iterable that will iterate through all pages
 */
export declare function iteratePages<T>(caller: PaginatedMethodCaller<T>, initialCursor?: string | undefined): AsyncIterableIterator<T>;
export {};
