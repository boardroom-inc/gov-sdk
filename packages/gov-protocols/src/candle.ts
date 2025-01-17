import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  OpenZeppelinGovernorAdapter,
  SnapshotAdapter,
  CovalentAdapter,
} from '@boardroom/gov-adapters';

export const registerCandle: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'candle';
  register({
    cname: cname,
    name: 'Candle',
    category: ['Protocol'],
    isEnabled: false,

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0xB80Be29667021AE0B617AC9eFe0a3A1a58033681',
        tokenAddress: '0xbc138bD20C98186CC0342C8e380953aF0cb48BA8',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const snapshot = new SnapshotAdapter({
        spaceName: 'cndl.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('candle', transports);
      const treasury = new CovalentAdapter('0xb80be29667021ae0b617ac9efe0a3a1a58033681', 1, transports);
      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/candlelabs_RazlN88RI.png',
              },
            ],
          };
        },
      });
    },
  });
};
