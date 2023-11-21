"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAavegotchi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAavegotchi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'aavegotchi';
    register({
        cname: cname,
        name: 'Aavegotchi',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'aavegotchi.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('aavegotchi', transports);
            // Treasury address sourced from https://aavegotchi.com/treasury
            const treasury = new gov_adapters_1.CovalentAdapter('0xffe6280ae4e864d9af836b562359fd828ece8020', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/aavegotchi_FoeOimy3UO.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAavegotchi = registerAavegotchi;
//# sourceMappingURL=aavegotchi.js.map