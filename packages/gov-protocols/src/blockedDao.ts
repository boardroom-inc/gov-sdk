import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerBlockedDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'blockedDao';
  register({
    cname: cname,
    name: 'Blocked DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x62f7c2165ee9b98d266d1c16e09c36d25965fd72',
        tokenAddress: '0x31430e0aee11961cfac6284537b7c5c56afddc29',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x0ac39e0d83f5021711ef3319641e8cc810055e2a', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/blockedDao_P_DR-QMec.png',
              },
            ],
          };
        },
      });
    },
  });
};
