"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerStargateFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerStargateFi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'stargatefi';
    register({
        cname: cname,
        name: 'stargatefi',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'stgdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('stargate-finance', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/stargatefinance_6uKoSfy0E.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerStargateFi = registerStargateFi;
//# sourceMappingURL=stargatefi.js.map