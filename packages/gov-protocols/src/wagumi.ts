import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerWagumi: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'wagumi';
  register({
    cname: cname,
    name: 'Wagumi',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'wagumi.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0xDCE4694e268bD83EA41B335320Ed11A684a1d7dB', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/wagumi_ay_Hn7q-0m.png',
              },
            ],
          };
        },
      });
    },
  });
};
