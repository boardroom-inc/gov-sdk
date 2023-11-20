"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOpendao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerOpendao = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'opendao';
    register({
        cname: cname,
        name: 'OpenDAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'theopendao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('opendao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xd08d0e994EeEf4001C63C72991Cf05918aDF191b', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/opendao_Gwr_Pq0qQ.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerOpendao = registerOpendao;
//# sourceMappingURL=opendao.js.map