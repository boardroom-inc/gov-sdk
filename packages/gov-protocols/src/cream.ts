import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerCreamFinance: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'creamfinance';
  register({
    cname: cname,
    name: 'CreamFinance',
    category: ['Protocol'],
    isEnabled: true,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'cream-finance.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('cream-2', transports);
      const treasury = new CovalentAdapter('0x6D5a7597896A703Fe8c85775B23395a48f971305', 1, transports);

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/creamfi_8AUjL1HCT.png',
              },
            ],
          };
        },
      });
    },
  });
};
