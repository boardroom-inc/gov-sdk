import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerXnouns: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'xnouns';
  register({
    cname: cname,
    name: 'XNouns',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xc00d0a3d1c16d957f278fa8cccb8b69b763f6a2a',
        tokenAddress: '0x2969eca285c9acd0b7eedebe7714c4d913700794',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x8e2e23364745003ccf8a99d17661c2790e8d6748', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/xnouns_uREYfZ_Qv.png',
              },
            ],
          };
        },
      });
    },
  });
};
