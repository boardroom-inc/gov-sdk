import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerGrugslair: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'grugslair';
  register({
    cname: cname,
    name: "Grug's Lair",
    category: ['Investment'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'grugslair.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0xB6Fc241c67C214D36fc4De65CA69F81b4302e7F4', 1, transports);

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/grugslair_c3yyxm9_j.png',
              },
            ],
          };
        },
      });
    },
  });
};
