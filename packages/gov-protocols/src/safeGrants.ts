import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerSafeGrants: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'safegrants';
  register({
    cname: cname,
    name: 'Safe Grants',
    category: ['Grants'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'grants.safe.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');

      // Each call is taking over 30 seconds. Disabled until that is fixed.
      // adapters.implement('delegation', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/safe_yyHjpiaIV.webp',
              },
            ],
          };
        },
      });
    },
  });
};
