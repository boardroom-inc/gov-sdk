import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerBankless: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'banklessvault';
  register({
    cname: cname,
    name: 'Bankless DAO',
    category: ['Media'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'banklessvault.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('bankless-dao', transports);
      const treasury = new CovalentAdapter('0xf26d1Bb347a59F6C283C53156519cC1B1ABacA51', 1, transports);

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bankless_A4-TfWnxz.png',
              },
            ],
          };
        },
      });
    },
  });
};
