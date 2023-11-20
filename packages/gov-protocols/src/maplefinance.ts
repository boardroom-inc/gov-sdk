import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerMapleFianance: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'maplefinance';
  register({
    cname: cname,
    name: 'Maple Finance',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('maple', transports);
      const treasury = new CovalentAdapter('0xa9466EaBd096449d650D5AEB0dD3dA6F52FD0B19', 1, transports);
      adapters.implement('treasury', treasury);
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/maplefinance_Tc5jlUK3S.png',
              },
            ],
          };
        },
      });
    },
  });
};
