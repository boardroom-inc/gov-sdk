import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerRariFoundation: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'rariFoundation';
  register({
    cname: cname,
    name: 'Rari Foundation',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x6552C8fb228f7776Fc0e4056AA217c139D4baDa1',
        tokenAddress: '0x096Bd9a7a2e703670088C05035e23c7a9F428496',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });

      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/rariFoundation_DTq0XrY9W.png',
              },
            ],
          };
        },
      });
    },
  });
};
