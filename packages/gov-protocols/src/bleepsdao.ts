import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsGovernorAdapter } from '@boardroom/gov-adapters';

export const registerBleepsDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'bleepsdao';
  register({
    cname: cname,
    name: 'Bleeps DAO',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governance = new NounsGovernorAdapter({
        governanceAddress: '0x3Dca1174b82e100A5f12e230AE803002edCDeE1C',
        tokenAddress: '0x9d27527Ada2CF29fBDAB2973cfa243845a08Bd3F',
        transports,
        protocolName: cname,
        alternateQuorumContract: true,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0xf850ceb782707df66a49b861ff74436be271611e', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bleepsdao_iS79xQ6wx.png',
              },
            ],
          };
        },
      });
    },
  });
};
