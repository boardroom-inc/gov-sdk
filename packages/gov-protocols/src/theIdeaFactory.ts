import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerTheIdeaFactory: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'theIdeaFactory';
  register({
    cname: cname,
    name: 'The Idea Factory',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xf80b6491ab54a4f01719388955f9c983bb5b43f4',
        tokenAddress: '0x483e842e56bfc9d21aeaf0e89c6c8144c25d2389',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xdeeb41c9d85747416604a09f6a4e59366d43630f', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/theIdeaFactory_5jcLssPV9.png',
              },
            ],
          };
        },
      });
    },
  });
};
