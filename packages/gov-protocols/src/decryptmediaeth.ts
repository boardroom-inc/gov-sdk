import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerdecryptmediaeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'decryptmediaeth',
    name: 'Decrypt Media',
    category: ['Media'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'decrypt-media.eth',
        transports,
        cname: 'decryptmediaeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/decryptmediaeth_bb0D9jFoh.png',
              },
            ],
          };
        },
      });
    },
  });
};
