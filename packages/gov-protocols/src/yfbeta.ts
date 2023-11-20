import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerYFBeta: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'yfbeta';
  register({
    cname: cname,
    name: 'yfBeta',
    category: ['Protocol'],
    isEnabled: false,

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({ spaceName: 'yfbeta', transports, cname, snapshotApiKey, boardroomAPIKey });
      const coingecko = new CoinGeckoAdapter('yfbeta', transports);

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
    },
  });
};
