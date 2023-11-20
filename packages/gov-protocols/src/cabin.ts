import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerCabin: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'cabin';
  register({
    cname: cname,
    name: 'Cabin',
    category: ['Uncategorized'],
    isEnabled: false,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'cabindao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('cabin', transports);

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/cabin_tFWC9_ixq.png',
              },
            ],
          };
        },
      });
    },
  });
};
