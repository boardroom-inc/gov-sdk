import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CompoundGovernorAlphaAdapter,
  CovalentAdapter,
  SnapshotAdapter,
} from '@boardroom/gov-adapters';

export const registerIndexed: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'indexed';
  register({
    cname: cname,
    name: 'Indexed',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('indexed-finance', transports);
      const snapshot = new SnapshotAdapter({
        spaceName: 'ndx.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x95129751769f99CC39824a0793eF4933DD8Bb74B',
        tokenAddress: '0x86772b1409b61c639EaAc9Ba0AcfBb6E238e5F83',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const treasury = new CovalentAdapter('0x78a3eF33cF033381FEB43ba4212f2Af5A5A0a2EA', 1, transports);

      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/indexedfi_7olMl2f_r.png',
              },
            ],
          };
        },
      });
    },
  });
};
