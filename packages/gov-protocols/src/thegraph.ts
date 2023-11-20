import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerTheGraph: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'graphprotocol';
  register({
    cname: cname,
    name: 'TheGraph',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'graphprotocol.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('the-graph', transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/thegraphcouncil_ugQZg_Nbg.png',
              },
            ],
          };
        },
      });
    },
  });
};
