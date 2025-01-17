import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CompoundGovernorAlphaAdapter,
  CovalentAdapter,
  SnapshotAdapter,
} from '@boardroom/gov-adapters';

export const registerRadicle: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'radicle';
  register({
    cname: cname,
    name: 'Radworks',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('radicle', transports);
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x690e775361AD66D1c4A25d89da9fCd639F5198eD',
        tokenAddress: '0x31c8EAcBFFdD875c74b94b077895Bd78CF1E64A3',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const treasury = new CovalentAdapter('0x8dA8f82d2BbDd896822de723F55D6EdF416130ba', 1, transports);
      const snapshot = new SnapshotAdapter({
        spaceName: 'gov.radicle.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Token_Logo_2023_MT-FG8nBa.png',
              },
            ],
          };
        },
      });
    },
  });
};
