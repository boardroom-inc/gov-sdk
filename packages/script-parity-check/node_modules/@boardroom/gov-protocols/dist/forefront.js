"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerForefront = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerForefront = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'forefront';
    register({
        cname: cname,
        name: 'Forefront',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ffdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('forefront', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x2Fb9F0ef424b24a8D293999298F392a33Fe6A8b5', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/forefront_4DJ13hAto.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerForefront = registerForefront;
//# sourceMappingURL=forefront.js.map