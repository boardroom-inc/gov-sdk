import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CompoundGovernorAlphaAdapter,
  SnapshotAdapter,
  CoinGeckoAdapter,
  CovalentAdapter,
} from '@boardroom/gov-adapters';

export const registerBraintrust: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'braintrust';
  register({
    cname: cname,
    name: 'Braintrust',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorAlphaAdapter({
        governanceAddress: '0x1a0D3d5a43e53510f80F16905Bc96e907A47dD01',
        tokenAddress: '0x799ebfABE77a6E34311eeEe9825190B9ECe32824',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      const snapshot = new SnapshotAdapter({
        spaceName: 'usebraintrust.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('braintrust', transports);
      const treasury = new CovalentAdapter('0xb6f1F016175588a049fDA12491cF3686De33990B', 1, transports);

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

      adapters.implement('treasury', treasury);
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/braintrust_OdpyKMQN3.png',
              },
            ],
          };
        },
      });
    },
  });
};
