import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerRadiantcapitaleth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'radiantcapitaleth',
    name: 'Radiant Capital',
    category: ['Protocol', 'Investment'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'radiantcapital.eth',
        transports,
        cname: 'radiantcapitaleth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/radiantcapitaleth_yWbqfXwtD.png',
              },
            ],
          };
        },
      });
    },
  });
};
