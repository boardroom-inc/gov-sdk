import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerBiFi: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'bifi';
  register({
    cname: cname,
    name: 'BiFi',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x54F50d2f584F1DD05307aB5eB298Ba96C7d4E0ea',
        tokenAddress: '0x22F68ae048B126ad76cd5dbc2c671603a188D6dc',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bifi_-W_khUYAP.png',
              },
            ],
          };
        },
      });
    },
  });
};
