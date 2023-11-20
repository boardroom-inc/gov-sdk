import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerPurpleDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'purpledao';
  register({
    cname: cname,
    name: 'Purple DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0xfb4a96541e1c70fc85ee512420eb0b05c542df57',
        tokenAddress: '0xa45662638e9f3bbb7a6fecb4b17853b7ba0f3a60',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0xeB5977F7630035fe3b28f11F9Cb5be9F01A9557D', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/purple_81Gyj7uG5.webp',
              },
            ],
          };
        },
      });
    },
  });
};
