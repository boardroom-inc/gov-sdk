import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerCompoundGrants: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'compoundgrants';
  register({
    cname: cname,
    name: 'Compound Grants',
    category: ['Grants'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'compoundgrants.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0xF1D8c2eED95D5fC2EaDe4E6Bb15a5969453E89a9', 1, transports);

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/compoundgrants_g1UeJZMkWe.png',
              },
            ],
          };
        },
      });
    },
  });
};
