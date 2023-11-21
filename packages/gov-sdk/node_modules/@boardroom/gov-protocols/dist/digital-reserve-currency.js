"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDigitalReserveCurrency = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDigitalReserveCurrency = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'drc';
    register({
        cname: cname,
        name: 'Digital Reserve Currency',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'drctoken.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('digital-reserve-currency', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x356b82b7a235242f578883132a60b7d8017900af', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/drc_-VGmrJ8Fx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDigitalReserveCurrency = registerDigitalReserveCurrency;
//# sourceMappingURL=digital-reserve-currency.js.map