import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerBuilderDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'builderdao';
  register({
    cname: cname,
    name: 'Builder DAO',
    category: ['Grants'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xe3F8d5488C69d18ABda42FCA10c177d7C19e8B1a',
        tokenAddress: '0xdf9b7d26c8fc806b1ae6273684556761ff02d422',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xDC9b96Ea4966d063Dd5c8dbaf08fe59062091B6D', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/nouns_builder_htOT0yILO.png',
              },
            ],
          };
        },
      });
    },
  });
};
