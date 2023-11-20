import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorBravoAdapter, CoinGeckoAdapter } from '@boardroom/gov-adapters';

export const registerReflexerFinance: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'reflexerfi';
  register({
    cname: cname,
    name: 'Reflexer Finance',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorBravoAdapter({
        governanceAddress: '0x7a6BBe7fDd793CC9ab7e0fc33605FCd2D19371E8',
        tokenAddress: '0x6243d8CEA23066d098a15582d81a598b4e8391F4',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const coingecko = new CoinGeckoAdapter('reflexer-ungovernance-token', transports);
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/reflexerfi_FaCEr6rO0.png',
              },
            ],
          };
        },
      });
    },
  });
};
