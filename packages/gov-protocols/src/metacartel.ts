import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CovalentAdapter, MolochGovernorAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerMetacartel: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'metacartel';
  register({
    cname: cname,
    name: 'Metacartel Ventures',
    category: ['Investment'],

    adapters: (adapters) => {
      const governor = new MolochGovernorAdapter({
        governanceAddress: '0x4570b4faf71e23942b8b9f934b47ccedf7540162',
        transports,
        protocolName: cname,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x4570b4fAF71E23942B8B9F934b47ccEdF7540162', 1, transports);

      const snapshot = new SnapshotAdapter({
        spaceName: 'mcv.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/metacartel_mO5rYtwcI.png',
              },
            ],
          };
        },
      });
    },
  });
};
