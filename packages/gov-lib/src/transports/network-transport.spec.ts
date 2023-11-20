import { NetworkTransportResolver } from './network-transport';

const FOO = {};
const BAR = {};

describe('NetworkTransportResolver', () => {
  it('should resolve things', () => {
    const resolver = new NetworkTransportResolver({ 1: FOO, '137': BAR });
    expect(resolver.network(1)).toBe(FOO);
    expect(resolver.network('137')).toBe(BAR);
  });
  it('should throw on missing', () => {
    const resolver = new NetworkTransportResolver({ 1: FOO, '137': BAR });
    expect(() => resolver.network(123)).toThrow('unable to resolve dependency');
  });
});
