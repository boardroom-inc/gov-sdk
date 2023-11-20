import { ProtocolRegistry } from './registry';

describe('ProtocolRegistry', () => {
  it('should register a protocol with no adapters', () => {
    const registry = new ProtocolRegistry();
    registry.register({ cname: 'protocol', name: 'Protocol', category: ['Social', 'Media'], isEnabled: true });
    const resolved = registry.get('protocol');
    expect(resolved).toEqual(expect.objectContaining({ cname: 'protocol' }));
  });
  it('should throw if resolving a missing protocol', () => {
    const registry = new ProtocolRegistry();
    const task = () => registry.get('protocol');
    expect(task).toThrow();
  });
  it('should throw if attempting to register a protocol with an existing cname', () => {
    const registry = new ProtocolRegistry();
    registry.register({ cname: 'protocol', name: 'Protocol', category: ['Social', 'Media'], isEnabled: true });
    const task = () =>
      registry.register({ cname: 'protocol', name: 'Protocol', category: ['Social', 'Media'], isEnabled: true });
    expect(task).toThrow();
  });
});

describe('TreasuryAdapter', () => {
  it('should throw on a malformed getBalance response', async () => {
    const registry = new ProtocolRegistry();
    registry.register({
      cname: 'protocol',
      name: 'Protocol',
      category: ['Social', 'Media'],
      isEnabled: true,
      adapters: (adapters) => {
        adapters.implement('treasury', {
          async getTreasuryAddresses() {
            return { addresses: ['address'] };
          },
          // @ts-expect-error returning an incorrect type on purpose
          async getBalance() {
            return { amount: 'bad', currency: 'usd' };
          },
          async getTokenBalances() {
            return {
              currency: 'usd',
              tokenBalances: [
                {
                  tokenBalance: '100',
                  balance: 10,
                  tokenContractAddress: '0x0000',
                  tokenDecimals: 18,
                  tokenName: 'token',
                  tokenSymbol: 'TKN',
                  tokenLogoUrl: 'https://tokenUrl.com/token.png',
                },
              ],
            };
          },
          async getTransfers() {
            return { transfers: [], pageNumber: 0, hasMorePages: false };
          },
          async getTransactions() {
            return {
              transactions: [
                {
                  address: 'blah',
                  chainId: 1,
                  txnHash: '12123',
                  value: '0',
                  fromAddress: 'abcd',
                  toAddress: 'asdfsd',
                  gasSpent: 0,
                  blockHeight: 1,
                },
              ],
              pageNumber: 0,
              hasMorePages: false,
            };
          },
        });
      },
    });

    const task = () => registry.get('protocol').adapter('treasury').getBalance('usd');
    await expect(task).rejects.toThrow();
  });
});
