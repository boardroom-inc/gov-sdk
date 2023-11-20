import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerHeadline: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'headline';
  register({
    cname: cname,
    name: 'Headline',
    category: ['Grants', 'Service', 'Media'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xb789eb50c71d0fc49d9f3126a6ba67f0c78810cc',
        tokenAddress: '0x3e4a08b6da666d7c239221e4429340975ec09c48',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x41a27ae22e4fe934524e5643683a261537f52725', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/headline_ESQaFVdY7.png',
              },
            ],
          };
        },
      });
    },
  });
};
