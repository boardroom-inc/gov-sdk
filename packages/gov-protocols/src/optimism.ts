import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, OpenZeppelinGovernorAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';
export const registerOptimism: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey,
  etherscanOptimismAPIKey
) => {
  const cname = 'optimism';
  register({
    cname: cname,
    name: 'Optimism',
    category: ['Protocol'],

    adapters: (adapters) => {
      const useTokenAddressForVotePower = true;
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0xcDF27F107725988f2261Ce2256bDfCdE8B382B10',
        tokenAddress: '0x4200000000000000000000000000000000000042',
        transports,
        protocolName: cname,
        chainId: 10,
        useTokenAddressForVotePower,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
        etherscanOptimismAPIKey,
      });

      adapters.implement('createOnChainProposal', governor, 'onchain-optimism');
      adapters.implement('proposals', governor, 'onchain-optimism');
      adapters.implement('vote', governor, 'onchain-optimism');

      adapters.implement('delegation', governor, 'onchain-optimism');
      adapters.implement('votePower', governor, 'onchain-optimism');
      adapters.implement('general', governor, 'onchain-optimism');

      const snapshot = new SnapshotAdapter({
        spaceName: 'opcollective.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('optimism', transports);
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/optimisim_GOmEteJGn.png',
              },
            ],
          };
        },
      });
    },
  });
};
