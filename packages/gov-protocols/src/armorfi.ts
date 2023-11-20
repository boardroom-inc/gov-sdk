import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CompoundGovernorAlphaAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerArmor: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'armorfi';
  register({
    cname: cname,
    name: 'Armor',
    category: ['Investment'],
    isEnabled: false,

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('armor', transports);
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x5aFeDeF1454CDd11d4705c06aa4D66Aa396343f6',
        tokenAddress: '0x5afeDef11AA9CD7DaE4023807810d97C20791dEC',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      //
      const treasury = new CovalentAdapter('0x1f28ed9d4792a567dad779235c2b766ab84d8e33', 1, transports);
      adapters.implement('treasury', treasury);
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/armorfi_HBYx5q7NUn.png',
              },
            ],
          };
        },
      });
    },
  });
};
