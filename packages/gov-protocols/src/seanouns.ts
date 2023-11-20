import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerSeanouns: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'seanouns';
  register({
    cname: cname,
    name: 'seaNouns',
    category: ['Media', 'Collector'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x7645cc72d025baa583a4209868344d2acb468a17',
        tokenAddress: '0xb8e3b7f90f785a1aa3445ff46cd293564320fd7b',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x306c0ccd0d76fcc26c1c5c41a5b1e7c8a377a839', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/seanouns_C8-VEMoFy.png',
              },
            ],
          };
        },
      });
    },
  });
};
