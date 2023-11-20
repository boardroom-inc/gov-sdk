import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerTestProtocol: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'testProtocol';
  register({
    cname: cname,
    name: 'testProtocol',
    isEnabled: false,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'mycontext.eth',
        transports,
        cname,
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/BR_-_Main-Logomark__1__60Ayi_UZf.png',
              },
            ],
          };
        },
      });
    },
  });
};
