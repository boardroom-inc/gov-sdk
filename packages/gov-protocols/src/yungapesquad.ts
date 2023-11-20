import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerYungApeSquad: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'yungapedao';
  register({
    cname: cname,
    name: 'Yung Ape Squad',
    category: ['Product'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'yungapedao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x76Dc0C73Dc211423bB15dAee3232eDDD52D0b725', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/yungapesquad_er7NW8v91.png',
              },
            ],
          };
        },
      });
    },
  });
};
