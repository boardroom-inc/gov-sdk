import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorAlphaAdapter } from '@boardroom/gov-adapters';

export const registerUnslashed: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'unslashed';
  register({
    cname: cname,
    name: 'Unslashed',
    category: ['Investment'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0xA0Ae994229b1BC31850d8A17a273904D1Ed12190',
        tokenAddress: '0xE0e05c43c097B0982Db6c9d626c4eb9e95C3b9ce',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/unslashedfinance_qpMmLvuww.png',
              },
            ],
          };
        },
      });
    },
  });
};
