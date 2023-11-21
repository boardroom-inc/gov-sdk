"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDefiDollar = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDefiDollar = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'defidollar';
    register({
        cname: cname,
        name: 'DefiDollar DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'defidolla.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('defidollar-dao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x5b5cF8620292249669e1DCC73B753d01543D6Ac7', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/defidollardao_6CYYXlf2k.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDefiDollar = registerDefiDollar;
//# sourceMappingURL=defidollar.js.map