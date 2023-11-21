"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.iteratePages = exports.extractPage = exports.serialize = exports.decodeCursor = exports.encodeCursor = void 0;
const base_64_1 = __importDefault(require("base-64"));
/**
 * Standard way to encode data deterministically into an opaque string.
 * NOTE: not deterministic for nested objects
 */
const encodeCursor = (item) => {
    return base_64_1.default.encode((0, exports.serialize)(item));
};
exports.encodeCursor = encodeCursor;
/**
 * Parse a cursor encoded with encodeCursor back into a record object
 */
const decodeCursor = (cursor) => {
    return cursor === undefined ? undefined : JSON.parse(base_64_1.default.decode(cursor));
};
exports.decodeCursor = decodeCursor;
/**
 * serialize a simple object with sorted fields
 * NOTE: not deterministic for nested objects
 */
const serialize = (keys) => {
    const sorted = Object.keys(keys).sort();
    const projected = {};
    sorted.forEach((k) => (projected[k] = keys[k]));
    return JSON.stringify(projected);
};
exports.serialize = serialize;
/**
 * Given an array of T items, take up to `take` items from the first item that
 * returns true for a start condition, exclusive
 */
// using any to avoid forcing the caller to return a strict bool in the predicate
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const extractPage = (items, exclusiveStartCondition, take = 20) => {
    const ret = { items: [] };
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
exports.extractPage = extractPage;
/**
 * Given a function that takes a cursor and returns a paginated response on T,
 * create an async iterable that will iterate through all pages
 */
async function* iteratePages(caller, initialCursor = undefined) {
    let cursor = initialCursor;
    while (true) {
        const resp = await caller(cursor);
        cursor = resp.nextCursor;
        yield* resp.items;
        if (cursor === undefined) {
            return;
        }
    }
}
exports.iteratePages = iteratePages;
//# sourceMappingURL=pagination.js.map