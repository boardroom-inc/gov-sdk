import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CompoundGovernorAlphaAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerBabylon: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'babylon';
  register({
    cname: cname,
    name: 'Babylon',
    category: ['Protocol'],
    isEnabled: false,

    adapters: (adapters) => {
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0xBEC3de5b14902C660Bd2C7EfD2F259998424cc24',
        tokenAddress: '0xF4Dc48D260C93ad6a96c5Ce563E70CA578987c74',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const coingecko = new CoinGeckoAdapter('babylon-finance', transports);
      const treasury = new CovalentAdapter('0xD7AAf4676F0F52993cb33aD36784BF970f0E1259', 1, transports);
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/babylonfi_bruHwi1yEr.png',
              },
            ],
          };
        },
      });
    },
  });
};
