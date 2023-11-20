import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { MolochGovernorAdapter } from '@boardroom/gov-adapters';

/**
 * This is a demo of a protocol that uses the polygon network with moloch adapter.
 * It is not currently enabled in the front end.
 */

export const registerUltraDAOV2: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'ultradaov2';
  register({
    cname: cname,
    name: 'UltraDAO V2',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0xdb278a7b6fd089b48ecca44bde4b24c6dcd29e0a',
        transports,
        chainId: 137,
        protocolName: cname,
        boardroomAPIKey,
      });
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ultradao_A-33meuHy.png',
              },
            ],
          };
        },
      });
    },
  });
};
