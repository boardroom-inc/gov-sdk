"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterables_1 = require("./iterables");
describe('bufferAsyncIterable', () => {
    it('should buffer full async iterable in order', async () => {
        async function* f() {
            yield 1;
            yield 2;
            yield 3;
        }
        expect(await (0, iterables_1.bufferAsyncIterable)(f())).toEqual([1, 2, 3]);
    });
});
//# sourceMappingURL=iterables.spec.js.map