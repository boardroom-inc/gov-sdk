import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerbullsontheblocketh: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'bullsontheblocketh',
    name: 'Bulls on the Block',
    category: ['Media'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'bullsontheblock.eth',
        transports,
        cname: 'bullsontheblocketh',
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('delegation', snapshot, 'snapshot');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/bullsontheblocketh_l1NuBxMjP.png',
              },
            ],
          };
        },
      });
    },
  });
};
