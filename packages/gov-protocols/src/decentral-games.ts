import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerDecentralGames: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'decentralgames';
  register({
    cname: cname,
    name: 'Decentral Games',
    category: ['Service'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'decentralgames.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('decentral-games', transports);
      const treasury = new CovalentAdapter('0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/decentralgames_LIUDA7nTo.png',
              },
            ],
          };
        },
      });
    },
  });
};
