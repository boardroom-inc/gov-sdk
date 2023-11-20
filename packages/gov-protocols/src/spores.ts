import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerSpores: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'spores';
  register({
    cname: cname,
    name: 'Spores',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x06d561a358125bfef073139f8cc24245e8998eb0',
        tokenAddress: '0x4e30bd0c525466e1bbb0b9028a596260c12b1561',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x173e5d2763ac4c2b81d8e1a4a4fe81ee184acfa9', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/spores__wA1pwgCzr.png',
              },
            ],
          };
        },
      });
    },
  });
};
