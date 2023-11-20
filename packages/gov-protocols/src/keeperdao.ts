import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerKeeperDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'keeperdao';
  register({
    cname: cname,
    name: 'Keeper DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'rook.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('rook', transports);
      const treasury = new CovalentAdapter('0x9a67F1940164d0318612b497E8e6038f902a00a4', 1, transports);
      adapters.implement('treasury', treasury);
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/keeperdao_WAWdj7_UiK.png',
              },
            ],
          };
        },
      });
    },
  });
};
