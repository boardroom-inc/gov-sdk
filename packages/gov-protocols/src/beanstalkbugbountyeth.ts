import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerbeanstalkbugbountyeth: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  register({
    cname: 'beanstalkbugbountyeth',
    name: 'Beanstalk Bug Bounty',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'beanstalkbugbounty.eth',
        transports,
        cname: 'beanstalkbugbountyeth',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/beanstalkbugbountyeth_wPE-Inz9f_.png',
              },
            ],
          };
        },
      });
    },
  });
};
