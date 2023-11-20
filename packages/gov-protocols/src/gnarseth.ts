import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registergnarseth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'gnarseth',
    name: 'Gnars',
    category: ['Grants'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'gnars.eth',
        transports,
        cname: 'gnarseth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/gnarseth_RkmswjKHnS.png',
              },
            ],
          };
        },
      });
    },
  });
};
