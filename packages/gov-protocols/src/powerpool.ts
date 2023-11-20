import { ProtocolRegistrationFunction } from '@boardroom/gov-lib';
import { CoinGeckoAdapter, CovalentAdapter } from '@boardroom/gov-adapters';

export const registerPowerpool: ProtocolRegistrationFunction = (register, transports) => {
  const cname = 'powerpool';
  register({
    cname: cname,
    name: 'Powerpool',
    category: ['Protocol'],
    isEnabled: false,

    adapters: (adapters) => {
      const coingecko = new CoinGeckoAdapter('concentrated-voting-power', transports);
      const treasury = new CovalentAdapter('0xB258302C3f209491d604165549079680708581Cc', 1, transports);

      adapters.implement('token', coingecko);
      adapters.implement('icons', coingecko);
      adapters.implement('treasury', treasury);
    },
  });
};
