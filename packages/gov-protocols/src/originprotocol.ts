import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerOriginProtocol: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'originprotocol';
  register({
    cname: cname,
    name: 'originprotocol',
    category: ['Protocol'],
    isEnabled: false,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'origingov.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('origin-protocol', transports);

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('delegation', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/originprotocol_csWD9YWjN.png',
              },
            ],
          };
        },
      });
    },
  });
};
