import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registergenesisblockseth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'genesisblockseth',
    name: 'Genesis Blocks',
    category: ['Collector'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'genesisblocks.eth',
        transports,
        cname: 'genesisblockseth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/genesisblockseth_LbErUqrDoR.png',
              },
            ],
          };
        },
      });
    },
  });
};
