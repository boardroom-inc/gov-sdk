import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerDcipeth: ProtocolRegistrationFunction = (register, transports, snapshotApiKey) => {
  register({
    cname: 'dcipeth',
    name: 'DCIP',
    category: ['Investment', 'Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({spaceName: 'dcip.eth', transports, cname: 'dcipeth', snapshotApiKey});

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/dcipeth_mZOTmBPfB.png',
              },
            ],
          };
        },
      });
    },
  });
};
