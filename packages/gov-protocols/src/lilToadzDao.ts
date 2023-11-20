import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerLilToadzDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'lilToadzDao';
  register({
    cname: cname,
    name: 'Lil Toadz DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x6a5a1ebc494a59060657253d978158f1170730cd',
        tokenAddress: '0xc0a2527d25ad9c7dee3f47e3497ca0093def26bc',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x1a499cd1d399d31e00fafefb227a2c16d1b05ac7', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/lilToadzDao_mHWccEzHY.png',
              },
            ],
          };
        },
      });
    },
  });
};
