import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorAlphaAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerGoodDollar: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'gooddollar';
  register({
    cname: cname,
    name: 'GoodDollar',
    category: ['Investment'],
    isEnabled: false,

    adapters: (adapters) => {
      // const coingecko = new CoinGeckoAdapter('gooddollar', transports);
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0xd356358f2da1018a3733a304E9bb39CF7ED51059',
        tokenAddress: '0x3A9299BE789ac3730e4E4c49d6d2Ad1b8BC34DFf',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0x6C35677206ae7FF1bf753877649cF57cC30D1c42', 1, transports);
      adapters.implement('treasury', treasury);
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      // adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gooddollar_hl4S6GQccB.png',
              },
            ],
          };
        },
      });
    },
  });
};
