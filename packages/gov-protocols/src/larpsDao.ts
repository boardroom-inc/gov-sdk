import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerLarpsDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'larpsDao';
  register({
    cname: cname,
    name: 'LARPS DAO',
    category: ['Media'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x7e18d92c66fc4e808f2efe906019566f0e02e35b',
        tokenAddress: '0xa545bf2f67944c81dfc7dcf8ad059cd4540c03de',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x9ec895c36b4122d509e5a552a22781eb8b3efff8', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/larpsDao_3nEvhu-iD.png',
              },
            ],
          };
        },
      });
    },
  });
};
