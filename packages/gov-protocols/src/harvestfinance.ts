import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerHarvestFinance: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'harvestfinance';
  register({
    cname: cname,
    name: 'Harvest Finance',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'harvestfi.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const coingecko = new CoinGeckoAdapter('harvest-finance', transports);
      const treasury = new CovalentAdapter(
        [
          '0xF49440C1F012d041802b25A73e5B0B9166a75c02',
          '0x843002b1d545ef7abb71c716e6179570582faa40',
          '0x7ee29bd96a0282d161a6c9cf3646537743ad8749',
          '0x19762b3b0Fe9b4d4Bd16eFA242CD1f3bCD5fa57C',
          '0x1b6c19b18cb1077e26136f33a2191779818338ed',
          '0xfed53aa679c2c1948473a08202f6203ebda20fd6',
          '0x7bf835e8975623063e498c4ca0ea92283100f2b3',
          '0xd00fce4966821da1edd1221a02af0afc876365e4',
          '0xf00dD244228F51547f0563e60bCa65a30FBF5f7f',
        ],
        1,
        transports
      );

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/harvestfinance_qFCYhnnyB.png',
              },
            ],
          };
        },
      });
    },
  });
};
