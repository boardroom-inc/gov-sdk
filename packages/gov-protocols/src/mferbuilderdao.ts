import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerMferbuilderdao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'mferbuilderdao';
  register({
    cname: cname,
    name: 'mferbuilderDAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x4a57ebeb2d0a33a5b9354fe2d5178373ccbab5f5',
        tokenAddress: '0x795d300855069f602862c5e23814bdeeb25dca6b',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x6d538bab6e961dd9719bd6f9676293989ca8d714', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/mferbuilderdao_pIber8UKs.png',
              },
            ],
          };
        },
      });
    },
  });
};
