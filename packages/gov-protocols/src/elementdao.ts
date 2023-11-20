import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CouncilAdapter,
  SnapshotAdapter,
  CovalentAdapter,
  lockingVaultABI,
  vestingVaultABI,
  getLockingVaultDelegations,
  getVestingVaultDelegations,
} from '@boardroom/gov-adapters';

export const registerElementDAO: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey
) => {
  const cname = 'elementdao';
  register({
    cname: cname,
    name: 'Element DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const council = new CouncilAdapter({
        coreVotingAddress: '0xEaCD577C3F6c44C3ffA398baaD97aE12CDCFed4a',
        tokenAddress: '0x5c6D51ecBA4D8E4F20373e3ce96a62342B125D6d',
        transports,
        protocolName: cname,
        votingVaults: [
          {
            address: '0x02Bd4A3b1b95b01F2Aa61655415A5d3EAAcaafdD',
            abi: lockingVaultABI,
            getDelegations: getLockingVaultDelegations,
          },
          {
            address: '0x6De73946eab234F1EE61256F10067D713aF0e37A',
            abi: vestingVaultABI,
            getDelegations: getVestingVaultDelegations,
          },
        ],
        proposalsOffChainDataURL:
          'https://raw.githubusercontent.com/element-foundation/council-kit/main/apps/council-ui/src/config/mainnet.ts',
        boardroomAPIKey,
      });
      const snapshot = new SnapshotAdapter({
        spaceName: 'elfi.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
      const treasury = new CovalentAdapter('0x82eF450FB7f06E3294F2f19ed1713b255Af0f541', 1, transports);

      adapters.implement('proposals', council, 'onchain');
      adapters.implement('vote', council, 'onchain');
      adapters.implement('votePower', council, 'onchain');
      adapters.implement('delegation', council, 'onchain');

      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');

      adapters.implement('treasury', treasury);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/elementdao.png',
              },
            ],
          };
        },
      });
    },
  });
};
