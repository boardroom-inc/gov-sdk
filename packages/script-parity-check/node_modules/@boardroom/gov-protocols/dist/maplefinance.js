"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMapleFianance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMapleFianance = (register, transports) => {
    const cname = 'maplefinance';
    register({
        cname: cname,
        name: 'Maple Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('maple', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xa9466EaBd096449d650D5AEB0dD3dA6F52FD0B19', 1, transports);
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
exports.registerMapleFianance = registerMapleFianance;
//# sourceMappingURL=maplefinance.js.map