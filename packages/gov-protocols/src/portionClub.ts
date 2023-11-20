import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerPortionClub: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'portionClub';
  register({
    cname: cname,
    name: 'Portion Club',
    category: ['Grants', 'Media', 'Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x04a52ea7d1647c405c48bbc5edb0f8159511fbf9',
        tokenAddress: '0x0c12aba58fc88f1267fa772012495b47aaf31cab',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x162421a61c5d40ffe3bc6d5ef546c00de4f49830', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/portionClub_TzJKiXQMZ.png',
              },
            ],
          };
        },
      });
    },
  });
};
