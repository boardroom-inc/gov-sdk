import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerGlobalCoinResearch: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'gcr';
  register({
    cname: cname,
    name: 'Global Coin Research',
    category: ['Uncategorized'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'globalcoinresearch.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('global-coin-research', transports);
      const treasury = new CovalentAdapter(
        [
          '0x26cb53c8e913Ed77977436c352D3a885baCe682c',
          '0x2cD50e33fa0E4523FAFe00C236ea8d1D241Ff1c4',
          '0xf787415cbc19E9F7f29d05342Eded87a38A8aB15',
          '0xE98c2Cf558B36310bd6a6E095109F6e5d11a015C',
          '0x3dCfaC500Cd642fe5C583d2E1C6dfE8437d1D69a',
          '0xC4dDC2F471a476da1b906727072669F95d37C622',
          '0xc01B3424b81da02A3aB626a44Cfe67c2eb15d9dA',
          '0xE09C9902682554B4743CB4b02bC0cdB538c2bEE6',
          '0xe601A52AF89f720d3970a2508737aB7E37AdD28e',
          '0xc01B3424b81da02A3aB626a44Cfe67c2eb15d9dA',
        ],
        1,
        transports
      );

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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gcr_QwTZ7gT2q.png',
              },
            ],
          };
        },
      });
    },
  });
};
