import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CompoundGovernorAlphaAdapter,
  CovalentAdapter,
  SnapshotAdapter,
} from '@boardroom/gov-adapters';

export const registerCryptex: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'cryptex';
  register({
    cname: cname,
    name: 'Cryptex',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x874C5D592AfC6803c3DD60d6442357879F196d5b',
        tokenAddress: '0x321C2fE4446C7c963dc41Dd58879AF648838f98D',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('cryptex-finance', transports);
      const treasury = new CovalentAdapter('0xa54074b2cc0e96a43048d4a68472F7F046aC0DA8', 1, transports);
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');

      const snapshot = new SnapshotAdapter({
        spaceName: 'cryptexdao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/cryptexfi_PMGF48QV1Y.png',
              },
            ],
          };
        },
      });
    },
  });
};
