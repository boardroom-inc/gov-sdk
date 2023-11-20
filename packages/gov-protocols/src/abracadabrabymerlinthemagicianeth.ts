import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerabracadabrabymerlinthemagicianeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'abracadabrabymerlinthemagicianeth',
    name: 'Magic Internet Money',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'abracadabrabymerlinthemagician.eth',
        transports,
        cname: 'abracadabrabymerlinthemagicianeth',
        snapshotApiKey,
        boardroomAPIKey
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/abracadabrabymerlinthemagicianeth_Bk5G6YaRb.png',
              },
            ],
          };
        },
      });
    },
  });
};
