import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerKlimaDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'klimadao';
  register({
    cname: cname,
    name: 'Klima DAO',
    category: ['Service'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'klimadao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('klima-dao', transports);
      const treasury = new CovalentAdapter('0x7Dd4f0B986F032A44F913BF92c9e8b7c17D77aD7', 137, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/klimadao_-8hKBu9Sl.png',
              },
            ],
          };
        },
      });
    },
  });
};
