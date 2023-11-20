import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  CovalentAdapter,
  OpenZeppelinGovernorAdapter,
  ZeroXTokenStaking,
} from '@boardroom/gov-adapters';

export const register0xGov: ProtocolRegistrationFunction = (
  register,
  transports,
  boardroomAPIKey,
  etherscanMainnetAPIKey,
  etherscanOptimismAPIKey,
) => {
  const cname = '0xgov-test';
  register({
    cname: cname,
    name: '0x Gov',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('0x', transports);
      const treasury = new CovalentAdapter('0x0bB1810061C2f5b2088054eE184E6C79e1591101', 1, transports);
      adapters.implement('token', coingecko);
      adapters.implement('treasury', treasury);

      const protocolGovernor = new OpenZeppelinGovernorAdapter({
          governanceAddress: '0x2FDCB13c9648c5eee97CeF7d8B7f02A66E5609B3',
          tokenAddress: '0xd85DeC683BaA87468246E10A168d4428B6179D58',
          transports,
          protocolName: cname,
          chainId: 5,
          boardroomAPIKey,
          etherscanMainnetAPIKey,
          etherscanOptimismAPIKey
        }
      );

      adapters.implement('proposalExecution', protocolGovernor, 'onchain');
      adapters.implement('proposals', protocolGovernor, 'onchain');
      adapters.implement('vote', protocolGovernor, 'onchain');
      adapters.implement('votePower', protocolGovernor, 'onchain');
      adapters.implement('delegation', protocolGovernor, 'onchain');
      adapters.implement('general', protocolGovernor, 'onchain');

      const treasuryGovernor = new OpenZeppelinGovernorAdapter(
        {
          governanceAddress: '0x2d3222CF6322977Dc81BBe8B1fbCd9C9c9E456DD',
          tokenAddress: '0xd85DeC683BaA87468246E10A168d4428B6179D58',
          transports,
          protocolName: cname,
          chainId: 5,
          boardroomAPIKey,
          etherscanMainnetAPIKey,
          etherscanOptimismAPIKey
        }
      );

      const stakingTokenAdapter = new ZeroXTokenStaking(
        '0x6156bfc950e669191af822c4a3c5e4196faabdc4',
        '0xd85DeC683BaA87468246E10A168d4428B6179D58',
        transports,
        5
      );

      adapters.implement('staking', stakingTokenAdapter);

      adapters.implement('createOnChainProposal', treasuryGovernor, 'onchain-secondary');
      adapters.implement('proposalExecution', treasuryGovernor, 'onchain-secondary');
      adapters.implement('proposals', treasuryGovernor, 'onchain-secondary');
      adapters.implement('vote', treasuryGovernor, 'onchain-secondary');
      adapters.implement('votePower', treasuryGovernor, 'onchain-secondary');
      adapters.implement('general', treasuryGovernor, 'onchain-secondary');

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
