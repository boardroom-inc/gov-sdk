import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerhbotprpeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'hbotprpeth',
    name: 'Hummingbot Pull Requests',
    category: ['Investment'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'hbot-prp.eth',
        transports,
        cname: 'hbotprpeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/hbotprpeth_08VMMchwcv.png',
              },
            ],
          };
        },
      });
    },
  });
};
