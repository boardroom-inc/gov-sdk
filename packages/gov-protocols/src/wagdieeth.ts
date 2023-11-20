import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerwagdieeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'wagdieeth',
    name: 'WAGDIE',
    category: ['Social', 'Collector'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'wagdie.eth',
        transports,
        cname: 'wagdieeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/wagdieeth_JASH5SL_P.png',
              },
            ],
          };
        },
      });
    },
  });
};
