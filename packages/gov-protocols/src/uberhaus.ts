import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { MolochGovernorAdapter } from '@boardroom/gov-adapters';

/**
 * This is a demo of a protocol that uses the xdai/gnosis network with moloch adapter.
 * It is not currently enabled in the front end.
 */

export const registerUberHaus: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'uberhaus';
  register({
    cname: cname,
    name: 'UberHAUS',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0xeF3d8C4Fbb1860FcEaB16595DB7E650cd5AD51c1',
        transports,
        chainId: 100,
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/uberhaus_Un-ZsqmeBn.png',
              },
            ],
          };
        },
      });
    },
  });
};
