import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, MolochGovernorAdapter } from '@boardroom/gov-adapters';

export const registerGameMineAlliance: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'gameminealliance';
  register({
    cname: cname,
    name: 'Game Mine Alliance',
    category: ['Investment'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0x26edf55480c50a2fab52d0d7bdf1dbbf2f4bb14f',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x26edf55480c50a2fab52d0d7bdf1dbbf2f4bb14f', 1, transports);
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gameminealliance_yz0hFSZ1b.png',
              },
            ],
          };
        },
      });
    },
  });
};
