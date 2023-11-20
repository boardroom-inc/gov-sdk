import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registeryieldguildeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'yieldguildeth',
    name: 'Yield Guild Games',
    category: ['Product', 'Social'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'yieldguild.eth',
        transports,
        cname: 'yieldguildeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/yieldguildeth_uhD1q0wVO0.png',
              },
            ],
          };
        },
      });
    },
  });
};
