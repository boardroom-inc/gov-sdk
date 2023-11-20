import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerBiswaporgeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'biswaporgeth',
    name: 'Biswap',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'biswap-org.eth',
        transports,
        cname: 'biswaporgeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/biswaporgeth_3oUTaJyDO.png',
              },
            ],
          };
        },
      });
    },
  });
};
