import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerDeveloperDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'devdao';
  register({
    cname: cname,
    name: 'Developer DAO',
    category: ['Service'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'devdao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/developerdao_UopJ3eLrq.png',
              },
            ],
          };
        },
      });
    },
  });
};
