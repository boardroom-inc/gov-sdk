"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRibbonFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRibbonFi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'ribbonfi';
    register({
        cname: cname,
        name: 'Ribbon Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'rbn.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('ribbon-finance', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xDAEada3d210D2f45874724BeEa03C7d4BBD41674', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ribbonfi_uGxwSVHwV.png',
                            },
                        ],
                    };
                },
            });
            adapters.implement('treasury', treasury);
        },
    });
};
exports.registerRibbonFi = registerRibbonFi;
//# sourceMappingURL=ribbonfi.js.map