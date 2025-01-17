import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorBravoAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerDefrag: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'defrag';
  register({
    cname: cname,
    name: 'Defrag',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorBravoAdapter({
        governanceAddress: '0x5ff6D58DEFDbd783f4f88E80E94D9481E2Bb0a45',
        tokenAddress: '0xdD93258A9C8b4C4EA900FD3043fc59Be05D624A6',
        transports,
        protocolName: cname,
        isTokenERC721: true,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0x6200831Ff20a4537b0B48aF1653B59c243E20443', 1, transports);
      adapters.implement('createOnChainProposal', governor, 'onchain');
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/defragfi_7_Qw_Rjy1.png',
              },
            ],
          };
        },
      });
    },
  });
};
