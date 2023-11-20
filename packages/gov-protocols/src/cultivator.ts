import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerCultivator: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'cultivatordaoeth';
  register({
    cname: cname,
    name: 'Cultivator DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'cultivatordao.eth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/cultivatordao_1is388ukr.png',
              },
            ],
          };
        },
      });
    },
  });
};
