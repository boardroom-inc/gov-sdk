"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMoonDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMoonDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'moondao';
    register({
        cname: cname,
        name: 'MoonDAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tomoondao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('mooney', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xce4a1E86a5c47CD677338f53DA22A91d85cab2c9', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/moondao_3kM2D_f-u.png',
                            },
                        ],
                    };
                },
            });
            adapters.implement('treasury', treasury);
        },
    });
};
exports.registerMoonDAO = registerMoonDAO;
//# sourceMappingURL=moondao.js.map