import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerBalancer: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'balancer';
  register({
    cname: cname,
    name: 'Balancer',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'balancer.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('balancer', transports);
      // Treasury addresses sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
      const treasury = new CovalentAdapter(
        ['0xb618F903ad1d00d6F7b92f5b0954DcdC056fC533', '0xce88686553686DA562CE7Cea497CE749DA109f9F'],
        1,
        transports
      );

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('delegation', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/balancer_0pMeDI5oC.png',
              },
            ],
          };
        },
      });
    },
  });
};
