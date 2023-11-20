import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerunipiloteth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'unipiloteth',
    name: 'Unipilot',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'unipilot.eth',
        transports,
        cname: 'unipiloteth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/unipiloteth_5flK_QBhNp.png',
              },
            ],
          };
        },
      });
    },
  });
};
