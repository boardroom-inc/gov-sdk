"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bufferAsyncIterable = void 0;
/**
 * Buffer an async iterable into an array
 */
const bufferAsyncIterable = async (iterable) => {
    const items = [];
    for await (const item of iterable) {
        items.push(item);
    }
    return items;
};
exports.bufferAsyncIterable = bufferAsyncIterable;
//# sourceMappingURL=iterables.js.map