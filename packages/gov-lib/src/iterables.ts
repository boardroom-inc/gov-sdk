/**
 * Buffer an async iterable into an array
 */
export const bufferAsyncIterable = async <T>(iterable: AsyncIterableIterator<T>): Promise<T[]> => {
  const items: T[] = [];
  for await (const item of iterable) {
    items.push(item);
  }
  return items;
};
