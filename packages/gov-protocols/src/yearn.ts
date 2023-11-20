import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerYearn: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey) => {
  const cname = 'ybaby';
  register({
    cname: cname,
    name: 'Yearn',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'ybaby.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const snapshotArchive = new SnapshotAdapter({
        spaceName: 'yearn',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('yearn-finance', transports);
      // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
      const treasury = new CovalentAdapter(
        [
          '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52',
          '0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde',
          '0xd42e1Cb8b98382df7Db43e0F09dFE57365659D16',
        ],
        1,
        transports
      );
      adapters.implement('proposals', snapshotArchive, 'archive');
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/yearn_CEniQ8rlg.png',
              },
            ],
          };
        },
      });
    },
  });
};
