import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerprimeratingeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'primeratingeth',
    name: 'Prime Rating',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'primerating.eth',
        transports,
        cname: 'primeratingeth',
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/primeratingeth_f5X_le7HW.png',
              },
            ],
          };
        },
      });
    },
  });
};
