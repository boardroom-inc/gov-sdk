import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerArtHaus: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'artHaus';
  register({
    cname: cname,
    name: 'Art Haus',
    category: ['Grants', 'Media'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x92fe16340f00fa0843ba42bc88a7403382aed6f3',
        tokenAddress: '0x65e0fed751abca42bc82006f84e31f5cd95d6d66',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x2c1df19c48ba6f5bd4f518b535879db6ac97578f', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/artHaus_dAaqTysv8.png',
              },
            ],
          };
        },
      });
    },
  });
};
