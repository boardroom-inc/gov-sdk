import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  OpenZeppelinGovernorAdapter,
  SnapshotAdapter,
  CovalentAdapter,
} from '@boardroom/gov-adapters';

export const registerGasDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'gasdao';
  register({
    cname: cname,
    name: 'GasDAO',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('gas-dao', transports);
      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x5B1751306597A76C8E6D2BFb8e952f8855Ed976d',
        tokenAddress: '0x6Bba316c48b49BD1eAc44573c5c871ff02958469',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const snapshot = new SnapshotAdapter({
        spaceName: 'gasdao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0xC9A7D537F17194c68455D75e3d742BF2c3cE3c74', 1, transports);

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gasdao_xkGVkSmnc.png',
              },
            ],
          };
        },
      });
    },
  });
};
