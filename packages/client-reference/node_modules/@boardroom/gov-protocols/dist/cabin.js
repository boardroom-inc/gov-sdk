"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCabin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCabin = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'cabin';
    register({
        cname: cname,
        name: 'Cabin',
        category: ['Uncategorized'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cabindao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('cabin', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/cabin_tFWC9_ixq.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCabin = registerCabin;
//# sourceMappingURL=cabin.js.map