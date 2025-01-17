import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerCreativeKidz: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'creativeKidz';
  register({
    cname: cname,
    name: 'CREATIVE Kidz',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xce0d114c11fc8de8b28e019589a7e48ccc6f8e8f',
        tokenAddress: '0x5da6ae3d2cce42dd0b805b0bc3befeab0e0b9cca',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xf4e35eda6f5c2a2dcca44d59deb930d4917180e0', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/creativeKidz_Byc4dKGmT.png',
              },
            ],
          };
        },
      });
    },
  });
};
