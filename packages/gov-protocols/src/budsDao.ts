import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerBudsDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'budsDao';
  register({
    cname: cname,
    name: 'Buds DAO',
    category: ['Grants'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x6bd69f2e9dbd8e90a2c88aa4658d445e7a9d5345',
        tokenAddress: '0x91f21621c0daa44791fb6481041f0e8f57d9f8ee',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xbe37211a680c5cc50086f9c90040fa0bb46f33dd', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/budsDao_kdscETcT6.png',
              },
            ],
          };
        },
      });
    },
  });
};
