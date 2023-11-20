import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsBuilderAdapter } from '@boardroom/gov-adapters';

export const registerSantaFeDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'santaFeDao';
  register({
    cname: cname,
    name: 'Santa Fe DAO',
    category: ['Media'],

    adapters: (adapters) => {
      const governance = new NounsBuilderAdapter({
        governanceAddress: '0x68b1ab965c34a2cbe437b8234b344b6e2747cd83',
        tokenAddress: '0x85b18314001aee1c0f0f2ce76b6af2598b5b2b7e',
        transports,
        protocolName: cname,
        boardroomAPIKey
      });
      const treasury = new CovalentAdapter('0x222e4ed1b96188749a8d378c16b7edf882aeffd1', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/santaFeDao_z2orgKEg1.png',
              },
            ],
          };
        },
      });
    },
  });
};
