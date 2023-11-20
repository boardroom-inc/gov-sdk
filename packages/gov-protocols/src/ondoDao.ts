import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorBravoAdapter } from '@boardroom/gov-adapters';

export const registerOndoDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'ondoDao';
  register({
    cname: cname,
    name: 'Ondo DAO',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorBravoAdapter({
        governanceAddress: '0x336505EC1BcC1A020EeDe459f57581725D23465A',
        tokenAddress: '0xfAbA6f8e4a5E8Ab82F62fe7C39859FA577269BE3',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });

      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/ondoDao_NSjoF_TzG.png',
              },
            ],
          };
        },
      });
    },
  });
};
