import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerLexPunk: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'lexpunk';
  register({
    cname: cname,
    name: 'LexPunk',
    category: ['Investment'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'lexpunk.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x316dAa88D931C7221e2E4039F6B793ba2b724180', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lexpunk_wcJhQMT74.png',
              },
            ],
          };
        },
      });
    },
  });
};
