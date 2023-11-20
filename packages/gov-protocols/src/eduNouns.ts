import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerEduNouns: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'eduNouns';
  register({
    cname: cname,
    name: 'Edu Nouns',
    category: ['Grants', 'Product'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xfbc3ddda6b253d98591e60142969eca767df3d97',
        tokenAddress: '0xb5d90081cd6f0d1a5338d2d832cc68371922f542',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x95816cb39b6806586e09abb52cff286f8ba8d22f', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/eduNouns_IJ5NWuPeu.png',
              },
            ],
          };
        },
      });
    },
  });
};
