"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSuperRare = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSuperRare = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'superrare';
    register({
        cname: cname,
        name: 'SuperRare',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'superraredao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('superrare', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x860a80d33E85e97888F1f0C75c6e5BBD60b48DA9', 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/superrare_r5DKuq5Ez.png',
                            },
                        ],
                    };
                },
            });
            adapters.implement('treasury', treasury);
        },
    });
};
exports.registerSuperRare = registerSuperRare;
//# sourceMappingURL=superrare.js.map