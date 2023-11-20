"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKeeperDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKeeperDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'keeperdao';
    register({
        cname: cname,
        name: 'Keeper DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'rook.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('rook', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x9a67F1940164d0318612b497E8e6038f902a00a4', 1, transports);
            adapters.implement('treasury', treasury);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/keeperdao_WAWdj7_UiK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerKeeperDAO = registerKeeperDAO;
//# sourceMappingURL=keeperdao.js.map