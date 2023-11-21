"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFrontier = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerFrontier = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'frontier';
    register({
        cname: cname,
        name: 'Frontier',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'frontier',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('frontier-token', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/frontierdotxyz_VGj6s1Px2.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerFrontier = registerFrontier;
//# sourceMappingURL=frontier.js.map