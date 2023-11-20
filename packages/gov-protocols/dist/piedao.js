"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPieDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPieDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'piedao';
    register({
        cname: cname,
        name: 'PieDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'piedao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('piedao-dough-v2', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x4efD8CEad66bb0fA64C8d53eBE65f31663199C6d', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/piedao_MMwVuqZKFv.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPieDAO = registerPieDAO;
//# sourceMappingURL=piedao.js.map