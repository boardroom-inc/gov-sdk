import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, NounsGovernorAdapter } from '@boardroom/gov-adapters';

export const registerNounsDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'nounsdao';
  register({
    cname: cname,
    name: 'Nouns DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governance = new NounsGovernorAdapter({
        governanceAddress: '0x6f3E6272A167e8AcCb32072d08E0957F9c79223d',
        tokenAddress: '0x9C8fF314C9Bc7F6e59A9d9225Fb22946427eDC03',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0x0BC3807Ec262cB779b38D65b38158acC3bfedE10', 1, transports);

      adapters.implement('proposals', governance, 'onchain');
      adapters.implement('vote', governance, 'onchain');
      adapters.implement('delegation', governance, 'onchain');
      adapters.implement('votePower', governance, 'onchain');
      adapters.implement('general', governance, 'onchain');
      adapters.implement('createOnChainProposal', governance, 'onchain');

      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/nounsdaogov_nPsB_SaoY.png',
              },
            ],
          };
        },
      });
    },
  });
};
