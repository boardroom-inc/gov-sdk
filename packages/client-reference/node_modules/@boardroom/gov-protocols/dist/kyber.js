"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKyber = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKyber = (register, transports) => {
    const cname = 'kyber';
    register({
        cname: cname,
        name: 'Kyber',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('kyber-network-crystal', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x3EB01B3391EA15CE752d01Cf3D3F09deC596F650', 1, transports);
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
exports.registerKyber = registerKyber;
//# sourceMappingURL=kyber.js.map