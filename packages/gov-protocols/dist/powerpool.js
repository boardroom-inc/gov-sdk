"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPowerpool = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPowerpool = (register, transports) => {
    const cname = 'powerpool';
    register({
        cname: cname,
        name: 'Powerpool',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('concentrated-voting-power', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xB258302C3f209491d604165549079680708581Cc', 1, transports);
            adapters.implement('token', coingecko);
            adapters.implement('icons', coingecko);
            adapters.implement('treasury', treasury);
        },
    });
};
exports.registerPowerpool = registerPowerpool;
//# sourceMappingURL=powerpool.js.map