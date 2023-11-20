"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMantraDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMantraDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'mantraDao';
    register({
        cname: cname,
        name: 'MantraDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mantra-dao',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('mantra-dao', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/mantradao_CBBPMKSct.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMantraDAO = registerMantraDAO;
//# sourceMappingURL=mantradao.js.map