import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerPridePunkDAO: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'pridepunk';
  register({
    cname: cname,
    name: 'Pride Punk DAO',
    category: ['Social'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x80BAE65E9D56498c7651C34cFB37e2F417C4A703',
        tokenAddress: '0x1755b682CfF797ee083FAf3F3e1C3e1015586c60',
        transports,
        protocolName: cname,
        isTokenERC721: true,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });

      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pridepunk.webp',
              },
            ],
          };
        },
      });
    },
  });
};