"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registersperaxdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registersperaxdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'speraxdaoeth',
        name: 'Sperax DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'speraxdao.eth',
                transports,
                cname: 'speraxdaoeth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/speraxdaoeth_gBL_p2jWHT.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registersperaxdaoeth = registersperaxdaoeth;
//# sourceMappingURL=speraxdaoeth.js.map