"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRocketPool = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRocketPool = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'rocketpool';
    register({
        cname: cname,
        name: 'Rocket Pool',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'rocketpool-dao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('rocket-pool', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/rocket_pool__RPL__3CTo39qkb.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRocketPool = registerRocketPool;
//# sourceMappingURL=rocketpool.js.map