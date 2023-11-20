import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import {
  CoinGeckoAdapter,
  MakerDaoGovernorExecutiveAdapter,
  MakerDaoGovernorPollingAdapter,
} from '@boardroom/gov-adapters';

export const registerMakerDao: ProtocolRegistrationFunction = (register, transports, boardroomAPIKey) => {
  const cname = 'makerdao';
  register({
    cname: cname,
    name: 'Maker DAO',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('maker', transports);

      const executiveGovernor = new MakerDaoGovernorExecutiveAdapter(
        {
          chiefAddress: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0', // DSChief governance contract
          tokenAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // token contract
          voteDelegateFactoryAddress: '0xd897f108670903d1d6070fcf818f9db3615af272', // vote delegate factory
          transports,
          protocolName: cname,
          boardroomAPIKey
        }
      );

      const pollingGovernor = new MakerDaoGovernorPollingAdapter(
        {
          chiefAddress: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0', // DSChief governance contract
          pollingAddress: '0xD3A9FE267852281a1e6307a1C37CDfD76d39b133', // polling contract
          tokenAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', // token contract
          voteProxyFactoryAddress: '0x6FCD258af181B3221073A96dD90D1f7AE7eEc408', // voteProxyFactory address
          voteDelegateFactoryAddress: '0xd897f108670903d1d6070fcf818f9db3615af272', // vote delegate factory
          transports,
          protocolName: cname,
          boardroomAPIKey
        }
      );

      adapters.implement('proposals', executiveGovernor, 'onchain');
      adapters.implement('vote', executiveGovernor, 'onchain');
      adapters.implement('votePower', executiveGovernor, 'onchain');
      adapters.implement('delegation', executiveGovernor, 'onchain');

      adapters.implement('proposals', pollingGovernor, 'onchain-secondary');
      adapters.implement('vote', pollingGovernor, 'onchain-secondary');
      adapters.implement('votePower', pollingGovernor, 'onchain-secondary');

      adapters.implement('token', coingecko);

      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/Mark_Maker_lN8u2ACB1.webp',
              },
            ],
          };
        },
      });
    },
  });
};
