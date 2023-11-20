import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CompoundGovernorAlphaAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerInverse: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'inverse';
  register({
    cname: cname,
    name: 'Inverse Finance',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('inverse-finance', transports);

      // https://docs.inverse.finance/smart-contracts
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x35d9f4953748b318f18c30634bA299b237eeDfff',
        tokenAddress: '0x41D5D79431A913C4aE7d69a668ecdfE5fF9DFB68',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const treasury = new CovalentAdapter('0x926dF14a23BE491164dCF93f4c468A50ef659D5B', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/inversefi_qF_KYvp0A.png',
              },
            ],
          };
        },
      });
    },
  });
};
