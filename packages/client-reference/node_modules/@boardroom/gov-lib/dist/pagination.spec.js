"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterables_1 = require("./iterables");
const pagination_1 = require("./pagination");
describe('encodeCursor', () => {
    it('should encode to same cursor regardless of field order', () => {
        const cursor1 = (0, pagination_1.encodeCursor)({ foo: 1, bar: 2 });
        const cursor2 = (0, pagination_1.encodeCursor)({ bar: 2, foo: 1 });
        expect(cursor1).toEqual(cursor2);
    });
});
describe('decodeCursor', () => {
    it('should decode an encoded cursor', () => {
        const payload = { foo: 1, bar: 2 };
        const cursor = (0, pagination_1.encodeCursor)(payload);
        expect((0, pagination_1.decodeCursor)(cursor)).toEqual(payload);
    });
    it('should return undefined when cursor is undefined', () => {
        expect((0, pagination_1.decodeCursor)(undefined)).toEqual(undefined);
    });
});
describe('extractPage', () => {
    const factory = () => [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }];
    it('should extract a simple page', () => {
        const items = factory();
        const page = (0, pagination_1.extractPage)(items, (x) => x.val === 2);
        expect(page).toEqual({ items: [{ val: 3 }, { val: 4 }] });
    });
    it('should respect take parameter', () => {
        const items = factory();
        const page = (0, pagination_1.extractPage)(items, (x) => x.val === 2, 1);
        expect(page).toEqual({ items: [{ val: 3 }], lastEvaluatedItem: { val: 3 } });
    });
    it('should not break with an empty array', () => {
        const page = (0, pagination_1.extractPage)([], (x) => x, 100);
        expect(page).toEqual({ items: [] });
    });
});
describe('iteratePages', () => {
    it('should iterate through multiple pages', async () => {
        const paginatedMethod = async (cursor) => {
            switch (cursor) {
                case undefined:
                    return {
                        items: [1, 2],
                        nextCursor: '2',
                    };
                case '2':
                    return {
                        items: [3, 4],
                    };
            }
            throw new Error();
        };
        const items = (0, pagination_1.iteratePages)(paginatedMethod);
        const buffer = await (0, iterables_1.bufferAsyncIterable)(items);
        expect(buffer).toEqual([1, 2, 3, 4]);
    });
});
//# sourceMappingURL=pagination.spec.js.map