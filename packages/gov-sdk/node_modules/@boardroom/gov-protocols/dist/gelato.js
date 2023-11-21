"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGelato = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGelato = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'gelato',
        name: 'Gelato',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gelato.eth',
                transports,
                cname: 'gelato',
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('gelato', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/gelato_YB4w7dpHW.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGelato = registerGelato;
//# sourceMappingURL=gelato.js.map