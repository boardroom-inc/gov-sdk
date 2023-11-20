import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  OpenZeppelinGovernorAdapter,
  CovalentAdapter,
  SnapshotAdapter,
} from '@boardroom/gov-adapters';

export const registerThresholdNetwork: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'threshold';
  register({
    cname: cname,
    name: 'Threshold Network',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0xd101f2B25bCBF992BdF55dB67c104FE7646F5447',
        tokenAddress: '0xCdF7028ceAB81fA0C6971208e83fa7872994beE5',
        transports,
        protocolName: cname,
        isTokenERC721: false,
        alternateDelegationAddress: '0x01B67b1194C75264d06F808A921228a95C765dd7',
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      const coingecko = new CoinGeckoAdapter('threshold-network-token', transports);
      const treasury = new CovalentAdapter(
        ['0x9F6e831c8F8939DC0C830C6e492e7cEf4f9C2F5f', '0x87F005317692D05BAA4193AB0c961c69e175f45f'],
        1,
        transports
      );
      const snapshot = new SnapshotAdapter({
        spaceName: 'threshold.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/thresholdnetwork_MOXPu_ajw.png',
              },
            ],
          };
        },
      });
    },
  });
};
