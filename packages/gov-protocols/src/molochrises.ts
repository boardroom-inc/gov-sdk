import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, MolochGovernorAdapter } from '@boardroom/gov-adapters';

export const registerMolochRises: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'molochrises';
  register({
    cname: cname,
    name: 'Moloch Rises',
    category: ['Investment'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0x519f9662798c2e07fbd5b30c1445602320c5cf5b',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter(['0x519f9662798c2e07fbd5b30c1445602320c5cf5b'], 1, transports);
      adapters.implement('treasury', treasury);
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/moloch_toOSi3l_UM.png',
              },
            ],
          };
        },
      });
    },
  });
};
