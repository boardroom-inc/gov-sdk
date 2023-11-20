import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorInterestAdapter } from '@boardroom/gov-adapters';

export const registerInterestProtocol: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'interest';
  register({
    cname: cname,
    name: 'Interest Protocol',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorInterestAdapter({
        governanceAddress: '0x266d1020a84b9e8b0ed320831838152075f8c4ca',
        tokenAddress: '0xd909c5862cdb164adb949d92622082f0092efc3d',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });

      adapters.implement('createOnChainProposal', governor, 'onchain');
      adapters.implement('proposals', governor, 'onchain');
      adapters.implement('vote', governor, 'onchain');
      adapters.implement('votePower', governor, 'onchain');
      adapters.implement('delegation', governor, 'onchain');
      adapters.implement('general', governor, 'onchain');

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ip_green_EDFqRMEVx.svg',
              },
            ],
          };
        },
      });
    },
  });
};
