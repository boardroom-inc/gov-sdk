import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerDaiPrizePool: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'daiprizepool';
  register({
    cname: cname,
    name: 'dai-prize-pool',
    category: ['Uncategorized'],
    isEnabled: false,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'dai-prize-pool',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url:
                  'https://raw.githubusercontent.com/boardroom-inc/protocol-Info/main/protocols/dai-prize-pool/logo.png',
              },
            ],
          };
        },
      });
    },
  });
};
