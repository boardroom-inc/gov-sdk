"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerparaswapdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerparaswapdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'paraswapdaoeth',
        name: 'ParaSwap DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'paraswap-dao.eth',
                transports,
                cname: 'paraswapdaoeth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/paraswapdaoeth_rPHjlqa3nL.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerparaswapdaoeth = registerparaswapdaoeth;
//# sourceMappingURL=paraswapdaoeth.js.map