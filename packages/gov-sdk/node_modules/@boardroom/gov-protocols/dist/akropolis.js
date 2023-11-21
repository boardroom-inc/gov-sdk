"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAkropolis = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAkropolis = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'akropolis';
    register({
        cname: cname,
        name: 'Akropolis',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({ spaceName: 'akropolis.eth', transports, cname, snapshotApiKey, boardroomAPIKey });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('akropolis', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x1d44b41A742D2b008A8faF655451aa015a59f248', 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/akropolis_O4FTZkkIw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAkropolis = registerAkropolis;
//# sourceMappingURL=akropolis.js.map