import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { OpenZeppelinGovernorAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerElyFi: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'elyfi';
  register({
    cname: cname,
    name: 'ElyFi',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: 'elyfi-bsc.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });

      const governor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x0c54629266d7fa40B4BFaF1640ebC2Cd093866C3',
        tokenAddress: '0xCD668B44C7Cf3B63722D5cE5F655De68dD8f2750',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
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

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/elyfi_LS-cwllE-.png',
              },
            ],
          };
        },
      });
    },
  });
};
