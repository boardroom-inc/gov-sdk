import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerkuwaoracleeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'kuwaoracleeth',
    name: 'Kuwa Oracle',
    category: ['Protocol'],

    // Adding a comment for testing purposes with a new build

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'kuwaoracle.eth',
        transports,
        cname: 'kuwaoracleeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/kuwaoracleeth_irf6Td4lG.png',
              },
            ],
          };
        },
      });
    },
  });
};
