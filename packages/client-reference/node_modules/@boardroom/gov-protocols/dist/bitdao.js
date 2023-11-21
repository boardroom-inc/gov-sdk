"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBitDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBitDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'bitdao';
    register({
        cname: cname,
        name: 'BitDAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'bitdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('bitdao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x78605Df79524164911C144801f41e9811B7DB73D', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bitdao_i6m7me25e9.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBitDAO = registerBitDAO;
//# sourceMappingURL=bitdao.js.map