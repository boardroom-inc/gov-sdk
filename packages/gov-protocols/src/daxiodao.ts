import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter } from '@boardroom/gov-adapters';

export const registerDaxiodao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'daxiodao';
  register({
    cname: cname,
    name: 'DaxioDAO',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0xDA9C9eD96f6D42f7e74f3C7eEa6772d64eD84bdf',
        tokenAddress: '0x431B366BE6069aE62f8121a901C6160B34Af7F80',
        transports,
        protocolName: cname,
        isTokenERC721: false,
        alternateDelegationAddress: undefined,
        useTokenAddressForVotePower: false,
        alternateVotePowerFunctionName: undefined,
        decimals: 8,
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/daxiodao_Eq_BWRjvq.png',
              },
            ],
          };
        },
      });
    },
  });
};
