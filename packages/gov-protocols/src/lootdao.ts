import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerLootDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'lootdao';
  register({
    cname: cname,
    name: 'LootDAO',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'loot-dao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x8cFDF9E9f7EA8c0871025318407A6f1Fbc5d5a18', 1, transports);
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lootdao_XCuzOwhIF.png',
              },
            ],
          };
        },
      });
    },
  });
};
