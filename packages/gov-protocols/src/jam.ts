import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerJam: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'jam';
  register({
    cname: cname,
    name: 'Jam',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xb8c3e118a1ff288de711f762d08e356b9db16699',
        tokenAddress: '0x47f4a9e95b011eabf084313868e90d02821a43ce',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x594af91dfbcc256050f4aa0251838bc89fa354e5', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/jam_rDgi5V43hX.png',
              },
            ],
          };
        },
      });
    },
  });
};
