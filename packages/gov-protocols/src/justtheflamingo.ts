import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerJusttheflamingo: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'justtheflamingo';
  register({
    cname: cname,
    name: 'JusttheFlamingo',
    category: ['Investment'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xd7cff20916a03f7da2e0dfdefef19aca423726c0',
        tokenAddress: '0xc58869c1c6ca866ab3b4664c848ed588f0de6a36',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x7c3d6a2fd8b1b4a5b034874c15ff6303179c6357', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/justtheflamingo_ZSHE-0f3kS.png',
              },
            ],
          };
        },
      });
    },
  });
};
