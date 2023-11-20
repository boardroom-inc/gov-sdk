import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerPublicAssembly: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'publicassembly';
  register({
    cname: cname,
    name: 'Public Assembly',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x2c376e79b2b3d342ff32efd0446c02e8682044e1',
        tokenAddress: '0xd2e7684cf3e2511cc3b4538bb2885dc206583076',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x8330e78222619fd26a9fbcbebaeb21339838bd30', 1, transports);

      adapters.implement('proposals', governance, 'onchain');
      adapters.implement('vote', governance, 'onchain');
      adapters.implement('delegation', governance, 'onchain');
      adapters.implement('votePower', governance, 'onchain');
      adapters.implement('general', governance, 'onchain');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/publicAssembly_PC_WHz0bb.png',
              },
            ],
          };
        },
      });
    },
  });
};
