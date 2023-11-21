"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPickle = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPickle = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'pickle';
    register({
        cname: cname,
        name: 'Pickle DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'pickle.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('pickle-finance', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pickledao_1WL_hMCZy.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPickle = registerPickle;
//# sourceMappingURL=pickle.js.map