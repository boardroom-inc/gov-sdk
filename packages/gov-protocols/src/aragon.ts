import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerAragon: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'aragon';
  register({
    cname: cname,
    name: 'Aragon',
    category: ['Product'], // DAO  Operating.System Framework

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({ spaceName: 'aragon', transports, cname, snapshotApiKey, boardroomAPIKey });
      const coingecko = new CoinGeckoAdapter('aragon', transports);
      const treasury = new CovalentAdapter('0xfb633F47A84a1450EE0413f2C32dC1772CcAea3e', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/aragon_sXzLParPs1.png',
              },
            ],
          };
        },
      });
    },
  });
};
