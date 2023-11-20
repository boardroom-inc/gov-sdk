import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerPresiderps: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'presiderps';
  register({
    cname: cname,
    name: 'Presiderps',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xa16275f692c0cd5183f6ae73d9fa5355bb0fe064',
        tokenAddress: '0xcf3f0efda2d312da992ac5533da8f0ed778439be',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x3c397ad94596a5edda8241964b4ed20e4f39b36b', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/presiderps_JfdbRScuB.png',
              },
            ],
          };
        },
      });
    },
  });
};
