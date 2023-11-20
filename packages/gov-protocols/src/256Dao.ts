import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const register256Dao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = '256Dao';
  register({
    cname: cname,
    name: '256 DAO',
    category: ['Media'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xe7c565fb16085f2603ec0c0df8819bd35d0689ad',
        tokenAddress: '0xae3a685663bdc9fd4871ae52fce38e5ccc7a894f',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0xf6dc273f71ad6f695a420aa54a8e674e1ef0326c', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/256Dao_hd6-jlJTZ.png',
              },
            ],
          };
        },
      });
    },
  });
};
