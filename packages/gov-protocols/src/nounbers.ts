import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerNounbers: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'nounbers';
  register({
    cname: cname,
    name: 'Nounbers',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x5a2aaeed954813e74da7278438851ba5b679ff0a',
        tokenAddress: '0x614106591ca1d30fa97ff8d4d25fb1523636caf6',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x7d7b15dbe6fd9aebd2c92b8be74a920a436ea84c', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/nounbers_n79uTe7hO2.png',
              },
            ],
          };
        },
      });
    },
  });
};
