import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { NounsGovernorAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerSpells: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'spells';
  register({
    cname: cname,
    name: 'Spells DAO',
    category: ['Collector'],

    adapters: (adapters) => {
      const governor = new NounsGovernorAdapter({
        governanceAddress: '0x2f8da73e52Ec56FeB0aE63FBDD50c01dd04E8CC9',
        tokenAddress: '0x7fef3f3364C7d8B9BFabB1b24D5CE92A402c6Bd3',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0x7ffaDE939718122c400435F86621bEA949591c48', 1, transports);

      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('treasury', treasury);

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/spells.webp',
              },
            ],
          };
        },
      });
    },
  });
};