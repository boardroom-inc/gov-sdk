import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerTheHomiesDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'theHomiesDao';
  register({
    cname: cname,
    name: 'The Homies DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x266fdc026f248ac287e8c106e4d18ae9f20938e4',
        tokenAddress: '0x785c9e48b8ff3f75d970932b89a16fba723a1195',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x551c2cfe16603c1caccf2ca569a19f33dea94429', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/theHomiesDao_-tecdrkPM.png',
              },
            ],
          };
        },
      });
    },
  });
};
