import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter, NounsGovernorAdapter, SnapshotAdapter } from '@boardroom/gov-adapters';

export const registerDopewars: ProtocolRegistrationFunction = (
  register,
  transports,
  snapshotApiKey,
  boardroomAPIKey,
  etherscanMainnetAPIKey
) => {
  const cname = 'dopewars';
  register({
    cname: cname,
    name: 'Dopewars',
    category: ['Product'],
    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('dope-wars-paper', transports);
      const treasury = new CovalentAdapter('0xb57ab8767cae33be61ff15167134861865f7d22c', 1, transports);

      const governance = new NounsGovernorAdapter({
        governanceAddress: '0xDBd38F7e739709fe5bFaE6cc8eF67C3820830E0C',
        tokenAddress: '0x8707276DF042E89669d69A177d3DA7dC78bd8723',
        transports,
        protocolName: cname,
        alternateQuorumContract: true,
        boardroomAPIKey,
        etherscanMainnetAPIKey,
      });
      adapters.implement('proposals', governance, 'onchain');
      adapters.implement('vote', governance, 'onchain');
      adapters.implement('delegation', governance, 'onchain');
      adapters.implement('votePower', governance, 'onchain');
      adapters.implement('general', governance, 'onchain');

      const snapshot = new SnapshotAdapter({
        spaceName: 'dopedao.eth',
        transports,
        cname,
        snapshotApiKey,
        boardroomAPIKey,
      });
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
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dopewars_jsWVtDLKh.png',
              },
            ],
          };
        },
      });
    },
  });
};
