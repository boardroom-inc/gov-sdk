import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  SnapshotAdapter,
  CoinGeckoAdapter,
  CovalentAdapter,
  OpenZeppelinGovernorAdapter,
  ZeroXTokenStaking,
} from '@boardroom/gov-adapters';

export const register0xGov: ProtocolRegistrationFunction = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
  const cname = '0xgov';
  register({
    cname: cname,
    name: '0x Gov',
    category: ['Protocol'],

    adapters: (adapters) => {
      const snapshot = new SnapshotAdapter({
        spaceName: '0xgov.eth',
        transports,
        cname,
        chainId: 1,
        snapshotApiKey,
        boardroomAPIKey
      });
      const coingecko = new CoinGeckoAdapter('0x', transports);
      const treasury = new CovalentAdapter('0x0bB1810061C2f5b2088054eE184E6C79e1591101', 1, transports);
      adapters.implement('proposals', snapshot, 'snapshot');
      adapters.implement('createProposal', snapshot, 'snapshot');
      adapters.implement('vote', snapshot, 'snapshot');
      adapters.implement('votePower', snapshot, 'snapshot');
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);

      const protocolGovernor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0xc256035fe8533f9ce362012a6ae0aefed4df30f4',
        tokenAddress: '0xFCfaf7834F134F5146dBB3274baB9bED4bAfa917',
        transports,
        protocolName: cname,
        etherscanMainnetAPIKey,
        boardroomAPIKey
      });

      adapters.implement('proposalExecution', protocolGovernor, 'onchain');
      adapters.implement('proposals', protocolGovernor, 'onchain');
      adapters.implement('vote', protocolGovernor, 'onchain');
      adapters.implement('votePower', protocolGovernor, 'onchain');
      adapters.implement('delegation', protocolGovernor, 'onchain');
      adapters.implement('general', protocolGovernor, 'onchain');

      const treasuryGovernor = new OpenZeppelinGovernorAdapter({
        governanceAddress: '0x4822cfc1e7699bdb9551bdfd3a838ee414bc2008',
        tokenAddress: '0xFCfaf7834F134F5146dBB3274baB9bED4bAfa917',
        transports,
        protocolName: cname,
        boardroomAPIKey,
        etherscanMainnetAPIKey
      });
      adapters.implement('createOnChainProposal', treasuryGovernor, 'onchain-secondary');
      adapters.implement('proposalExecution', treasuryGovernor, 'onchain-secondary');
      adapters.implement('proposals', treasuryGovernor, 'onchain-secondary');
      adapters.implement('vote', treasuryGovernor, 'onchain-secondary');
      adapters.implement('votePower', treasuryGovernor, 'onchain-secondary');
      adapters.implement('delegation', treasuryGovernor, 'onchain-secondary');
      adapters.implement('general', treasuryGovernor, 'onchain-secondary');

      const stakingTokenAdapter = new ZeroXTokenStaking(
        '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
        '0xFCfaf7834F134F5146dBB3274baB9bED4bAfa917',
        transports
      );

      adapters.implement('staking', stakingTokenAdapter);

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/Logo%20large_xoyM36Ome.png',
              },
            ],
          };
        },
      });
    },
  });
};
