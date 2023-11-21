"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDynamicSetDollar = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDynamicSetDollar = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'dsd';
    register({
        cname: cname,
        name: 'DynamicSetDollar',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dsd.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('dynamic-set-dollar', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
        },
    });
};
exports.registerDynamicSetDollar = registerDynamicSetDollar;
//# sourceMappingURL=dsd.js.map