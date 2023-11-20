import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerNounjisDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'nounjisDao';
  register({
    cname: cname,
    name: 'Nounjis DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x94a29e9e306130be626f426adcc9dc55d5c57606',
        tokenAddress: '0xe6a2566da6f4a87db01941b5655201390cb7a1a4',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x2f07bb6454daf6644808a12a0d8e0bad0fd6bf25', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/nounjisDao_RczLPrrLYO.png',
              },
            ],
          };
        },
      });
    },
  });
};
