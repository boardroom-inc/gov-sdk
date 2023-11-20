import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerEPNS: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'epns';
  register({
    cname: cname,
    name: 'Push Protocol',
    category: ['Service'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'pushdao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('ethereum-push-notification-service', transports);
      const treasury = new CovalentAdapter('0x68A9832153fd7f95f1a3FA24fcCC3D63a6486E66', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Bell_2GPsRDTxS.png',
              },
            ],
          };
        },
      });
    },
  });
};
