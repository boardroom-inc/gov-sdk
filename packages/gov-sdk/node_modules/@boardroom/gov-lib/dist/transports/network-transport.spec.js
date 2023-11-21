"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const network_transport_1 = require("./network-transport");
const FOO = {};
const BAR = {};
describe('NetworkTransportResolver', () => {
    it('should resolve things', () => {
        const resolver = new network_transport_1.NetworkTransportResolver({ 1: FOO, '137': BAR });
        expect(resolver.network(1)).toBe(FOO);
        expect(resolver.network('137')).toBe(BAR);
    });
    it('should throw on missing', () => {
        const resolver = new network_transport_1.NetworkTransportResolver({ 1: FOO, '137': BAR });
        expect(() => resolver.network(123)).toThrow('unable to resolve dependency');
    });
});
//# sourceMappingURL=network-transport.spec.js.map