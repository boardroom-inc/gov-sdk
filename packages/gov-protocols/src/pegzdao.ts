import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, MolochGovernorAdapter } from '@boardroom/gov-adapters';

export const registerPegzDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'pegzdao';
  register({
    cname: cname,
    name: 'PegzDAO',
    category: ['Grants'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0x36fab4ac1d36e5f1015236261e42365cb4feac52',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x36fab4ac1d36e5f1015236261e42365cb4feac52', 1, transports);
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pegzdao_iSATkVlE5.png',
              },
            ],
          };
        },
      });
    },
  });
};
