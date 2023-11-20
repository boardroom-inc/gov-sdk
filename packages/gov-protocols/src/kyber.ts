import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerKyber: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'kyber';
  register({
    cname: cname,
    name: 'Kyber',
    category: ['Protocol'],

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('kyber-network-crystal', transports);
      const treasury = new CovalentAdapter('0x3EB01B3391EA15CE752d01Cf3D3F09deC596F650', 1, transports);
      adapters.implement('treasury', treasury);
      adapters.implement('token', coingecko);
      adapters.implement('icons', {
        async getIcons() {
          return {
            icons: [
              {
                size: 'normal',
                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/kyberdao_oHEUmo0uz.png',
              },
            ],
          };
        },
      });
    },
  });
};
