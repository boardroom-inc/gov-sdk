import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerPlasmaFinance: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = '0xplasma';
  register({
    cname: cname,
    name: 'Plasma Finance',
    category: ['Product'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: '0xplasma.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('delegation', snapshot, 'snapshot');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/0xplasma_7n16_RARo.png',
              },
            ],
          };
        },
      });
    },
  });
};
