"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVisor = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerVisor = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'visor';
    register({
        cname: cname,
        name: 'Visor',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'visor.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('visor', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/visorfinance_VUG3SfPYr.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerVisor = registerVisor;
//# sourceMappingURL=visor.js.map