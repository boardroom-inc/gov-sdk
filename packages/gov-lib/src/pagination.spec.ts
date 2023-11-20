import { bufferAsyncIterable } from './iterables';
import { decodeCursor, encodeCursor, extractPage, iteratePages, PaginatedResponse } from './pagination';

describe('encodeCursor', () => {
  it('should encode to same cursor regardless of field order', () => {
    const cursor1 = encodeCursor({ foo: 1, bar: 2 });
    const cursor2 = encodeCursor({ bar: 2, foo: 1 });
    expect(cursor1).toEqual(cursor2);
  });
});

describe('decodeCursor', () => {
  it('should decode an encoded cursor', () => {
    const payload = { foo: 1, bar: 2 };
    const cursor = encodeCursor(payload);
    expect(decodeCursor(cursor)).toEqual(payload);
  });
  it('should return undefined when cursor is undefined', () => {
    expect(decodeCursor(undefined)).toEqual(undefined);
  });
});

describe('extractPage', () => {
  const factory = () => [{ val: 1 }, { val: 2 }, { val: 3 }, { val: 4 }];
  it('should extract a simple page', () => {
    const items = factory();
    const page = extractPage(items, (x) => x.val === 2);
    expect(page).toEqual({ items: [{ val: 3 }, { val: 4 }] });
  });
  it('should respect take parameter', () => {
    const items = factory();
    const page = extractPage(items, (x) => x.val === 2, 1);
    expect(page).toEqual({ items: [{ val: 3 }], lastEvaluatedItem: { val: 3 } });
  });
  it('should not break with an empty array', () => {
    const page = extractPage([] as string[], (x) => x, 100);
    expect(page).toEqual({ items: [] });
  });
});

describe('iteratePages', () => {
  it('should iterate through multiple pages', async () => {
    const paginatedMethod = async (cursor: string | undefined): Promise<PaginatedResponse<number>> => {
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
    const items = iteratePages(paginatedMethod);
    const buffer = await bufferAsyncIterable(items);
    expect(buffer).toEqual([1, 2, 3, 4]);
  });
});
