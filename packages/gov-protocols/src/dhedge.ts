import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerDHedge: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'dhedge';
  register({
    cname: cname,
    name: 'dHEDGE',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'gov.dhedge.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('dhedge-dao', transports);
      const treasury = new CovalentAdapter('0xB76E40277B79B78dFa954CBEc863D0e4Fd0656ca', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dhedge_GowBCK9XV.png',
              },
            ],
          };
        },
      });
    },
  });
};
