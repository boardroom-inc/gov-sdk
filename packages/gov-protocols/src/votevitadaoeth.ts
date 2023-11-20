import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { SnapshotAdapter } from '@boardroom/gov-adapters';

export const registervotevitadaoeth: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  register({
    cname: 'votevitadaoeth',
    name: 'VitaDAO',
    category: ['Collector', 'Grants'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'vote.vitadao.eth',
        transports,
        cname: 'votevitadaoeth',
        snapshotApiKey,
        boardroomAPIKey,
      });

      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/votevitadaoeth_HV0DAZRVD.png',
              },
            ],
          };
        },
      });
    },
  });
};
