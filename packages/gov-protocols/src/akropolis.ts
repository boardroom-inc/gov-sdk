import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerAkropolis: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'akropolis';
  register({
    cname: cname,
    name: 'Akropolis',
    category: ['Product'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({ spaceName: 'akropolis.eth', transports, cname, snapshotApiKey, boardroomAPIKey });
      const coingecko = new CoinGeckoAdapter('akropolis', transports);
      const treasury = new CovalentAdapter('0x1d44b41A742D2b008A8faF655451aa015a59f248', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/akropolis_O4FTZkkIw.png',
              },
            ],
          };
        },
      });
    },
  });
};
