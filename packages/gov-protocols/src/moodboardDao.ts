import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerMoodboardDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'moodboardDao';
  register({
    cname: cname,
    name: 'Moodboard DAO',
    category: ['Media', 'Service'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xa1ee281e68a82fd56d2505d623b975a3b373cf05',
        tokenAddress: '0x01086448b54a67aff997160f143e0affe779a6ae',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x3bcb98c0cb45ab42f6599687d1f7f18aa26b1e94', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/moodboardDao_EXva6C1-U.png',
              },
            ],
          };
        },
      });
    },
  });
};
