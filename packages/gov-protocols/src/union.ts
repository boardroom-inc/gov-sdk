import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CompoundGovernorBravoAdapter } from '@boardroom/gov-adapters';

/*

  closest thing to an official source I could find:

  https://discord.com/channels/562828676480237578/846742089392062545/846924385943814154

*/
export const registerUnion: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = 'union';
  register({
    cname: cname,
    name: 'Union',
    category: ['Protocol'],

    adapters: (adapters) => {
      const governor = new CompoundGovernorBravoAdapter({
        governanceAddress: '0xe1b3F07a9032F0d3deDf3E96c395A4Da74130f6e',
        tokenAddress: '0x5Dfe42eEA70a3e6f93EE54eD9C321aF07A85535C',
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/unionprotocol_vgd0MMb0u.png',
              },
            ],
          };
        },
      });
    },
  });
};
