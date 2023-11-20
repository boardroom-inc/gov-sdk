import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const register10b57e6da0eth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: '10b57e6da0eth',
    name: '10b57e6da0',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: '10b57e6da0.eth',
        transports,
        cname: '10b57e6da0eth',
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/10b57e6da0eth_t-IjtrJip.png',
              },
            ],
          };
        },
      });
    },
  });
};
