import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerBabyDogeArmy: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'babydogearmy';
  register({
    cname: cname,
    name: 'Baby Doge Army',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'babydogearmy.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const snapshotTwo = new SnapshotAdapter({
        spaceName: 'babydogevote.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      const coingecko = new CoinGeckoAdapter('baby-doge-coin', transports);

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('proposals', snapshotTwo, 'archive');
      adapters.implement('vote', snapshotTwo, 'archive');
      adapters.implement('votePower', snapshotTwo, 'archive');
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/babydogearmy_WOagReXeG.png',
              },
            ],
          };
        },
      });
    },
  });
};
