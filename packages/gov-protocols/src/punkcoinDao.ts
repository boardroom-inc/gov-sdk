import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerPunkcoinDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'punkcoinDao';
  register({
    cname: cname,
    name: 'Punkcoin DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xd475a3cae86bedaeacba0131ad6288299638655d',
        tokenAddress: '0x7e15c18ce229b3a1600132ceadb8c344e4c2d669',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x5a606083edb9da2fd72240ebdb9c0baf4e865d82', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/punkcoinDao_s3CA_Ni-4L.png',
              },
            ],
          };
        },
      });
    },
  });
};
