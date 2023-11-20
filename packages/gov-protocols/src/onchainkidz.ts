import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerOnchainkidz: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'onchainkidz';
  register({
    cname: cname,
    name: 'OnChainKidz',
    category: ['Social', 'Grants'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xf15c95d17e89073871c1452b82a6cdd650d96cf6',
        tokenAddress: '0xab922509a8b3bdfc71e97bce4fe1d9bf31ac10dd',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xe8073d3605a7b70601c41a0c0f26f1df70fab6e8', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/onchainkidz_FqDG8o03b.png',
              },
            ],
          };
        },
      });
    },
  });
};
