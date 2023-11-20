import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerGoodkarma: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'goodkarma';
  register({
    cname: cname,
    name: 'Good Karma DAO',
    category: ['Service'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'goodkarmarecords.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('karma-dao', transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/goodkarmadao_cwSIKuaos.png',
              },
            ],
          };
        },
      });
    },
  });
};
