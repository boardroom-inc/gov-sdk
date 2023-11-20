import base64 from 'base-64';

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

  /* request certain proposals with Ids*/
  proposalIds?: Array<String>;

  /* request certain proposals based on proposal status type*/
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
export const encodeCursor = <T = Record<string, unknown>>(item: T): string => {
  return base64.encode(serialize(item as Record<string, unknown>));
};

/**
 * Parse a cursor encoded with encodeCursor back into a record object
 */
export const decodeCursor = <T = Record<string, unknown>>(cursor: string | undefined): T | undefined => {
  return cursor === undefined ? undefined : JSON.parse(base64.decode(cursor));
};

/**
 * serialize a simple object with sorted fields
 * NOTE: not deterministic for nested objects
 */
export const serialize = (keys: Record<string, unknown>): string => {
  const sorted = Object.keys(keys).sort();
  const projected: Record<string, unknown> = {};
  sorted.forEach((k) => (projected[k] = keys[k]));
  return JSON.stringify(projected);
};

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
// using any to avoid forcing the caller to return a strict bool in the predicate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const extractPage = <T>(items: T[], exclusiveStartCondition: (item: T) => any, take = 20): ExtractedPage<T> => {
  const ret: ExtractedPage<T> = { items: [] };

  // starting *exclusive* of the item that matches our condition, if not found,
  // startIndex will equal zero as well
  const startIndex = items.findIndex(exclusiveStartCondition) + 1;
  const endIndex = Math.min(items.length, startIndex + take);

  // safe to overflow, works as expected
  ret.items = items.slice(startIndex, endIndex);

  // include the last evaluated item if there are more items in the list
  if (endIndex < items.length && ret.items.length > 0) {
    ret.lastEvaluatedItem = ret.items[ret.items.length - 1];
  }

  return ret;
};

type PaginatedMethodCaller<T> = (cursor: string | undefined) => Promise<PaginatedResponse<T>>;

/**
 * Given a function that takes a cursor and returns a paginated response on T,
 * create an async iterable that will iterate through all pages
 */
export async function* iteratePages<T>(
  caller: PaginatedMethodCaller<T>,
  initialCursor: string | undefined = undefined
): AsyncIterableIterator<T> {
  let cursor = initialCursor;

  while (true) {
    const resp: PaginatedResponse<T> = await caller(cursor);
    cursor = resp.nextCursor;
    yield* resp.items;
    if (cursor === undefined) {
      return;
    }
  }
}
