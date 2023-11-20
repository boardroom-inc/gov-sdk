import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CovalentAdapter,
  SnapshotAdapter,
  CompoundGovernorBravoAdapter,
} from '@boardroom/gov-adapters';
//Previously bxz
export const registerOOKI: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'ooki';
  register({
    cname: cname,
    name: 'OOKI',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'ooki.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('ooki', transports);
      const treasury = new CovalentAdapter('0xfedc4dd5247b93feb41e899a09c44cfabec29cbc', 1, transports);
      const governor = new CompoundGovernorBravoAdapter({
        governanceAddress: '0x3133b4F4dcffc083724435784fEFAD510FA659c6',
        tokenAddress: '0x0de05f6447ab4d22c8827449ee4ba2d5c288379b',
        transports,
        protocolName: cname,
        alternateVoteDelegatorAddress: '0xEA936212fE4f3A69d0E8eCF9a2a35D6c1f8D2c89',
        boardroomAPIKey,
        etherscanMainnetAPIKey,
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ooki_gNnheO3Xk.png',
              },
            ],
          };
        },
      });
    },
  });
};
