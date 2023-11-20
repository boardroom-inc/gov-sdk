import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerBlvkhvnd: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'blvkhvnd';
  register({
    cname: cname,
    name: 'BLVKHVND',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xa54ce3c884c68c01596853b25a3208acefda540e',
        tokenAddress: '0x351ea1a718521f22718ae14f7d380ae345fad043',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x3bdc8d32934b4736598c4206d0a56911bf833e8c', 1, transports);

      adapters.implement('proposals', governance, 'onchain');
      adapters.implement('vote', governance, 'onchain');
      adapters.implement('delegation', governance, 'onchain');
      adapters.implement('votePower', governance, 'onchain');
      adapters.implement('general', governance, 'onchain');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/blvkhvnd_dL3uG3BK1.png',
              },
            ],
          };
        },
      });
    },
  });
};
