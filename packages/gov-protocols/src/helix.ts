import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerHelix: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  register({
    cname: 'helixgeometryeth',
    name: 'Helix',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'helixgeometry.eth',
        transports,
        cname: 'helixgeometryeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/helixgeometry_ZeY-XGqPN.png',
              },
            ],
          };
        },
      });
    },
  });
};
