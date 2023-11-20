import { bufferAsyncIterable } from './iterables';

describe('bufferAsyncIterable', () => {
  it('should buffer full async iterable in order', async () => {
    async function* f(): AsyncIterableIterator<number> {
      yield 1;
      yield 2;
      yield 3;
    }
    expect(await bufferAsyncIterable(f())).toEqual([1, 2, 3]);
  });
});
