"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKleros = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKleros = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'kleros';
    register({
        cname: cname,
        name: 'Kleros',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'kleros.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('kleros', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x67a57535b11445506a9e340662CD0c9755E5b1b4', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/kleros_DiRYzTUUL.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerKleros = registerKleros;
//# sourceMappingURL=kleros.js.map