"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAragon = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAragon = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'aragon';
    register({
        cname: cname,
        name: 'Aragon',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({ spaceName: 'aragon', transports, cname, snapshotApiKey, boardroomAPIKey });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('aragon', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xfb633F47A84a1450EE0413f2C32dC1772CcAea3e', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/aragon_sXzLParPs1.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAragon = registerAragon;
//# sourceMappingURL=aragon.js.map