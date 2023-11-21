"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGearbox = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGearbox = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'gearbox';
    register({
        cname: cname,
        name: 'Gearbox DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gearbox.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x7b065Fcb0760dF0CEA8CFd144e08554F3CeA73D1', 1, transports);
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('gearbox', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gearbox_7_D-OT093.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGearbox = registerGearbox;
//# sourceMappingURL=gearbox.js.map