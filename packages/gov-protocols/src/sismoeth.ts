import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registersismoeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'sismoeth',
    name: 'Sismo DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'sismo.eth',
        transports,
        cname: 'sismoeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/sismoeth_S0Vzpz2ILw.png',
              },
            ],
          };
        },
      });
    },
  });
};
