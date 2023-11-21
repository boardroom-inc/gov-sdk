"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerconicdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerconicdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'conicdaoeth',
        name: 'Conic',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'conic-dao.eth',
                transports,
                cname: 'conicdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/conicdaoeth_3SntE3NGU.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerconicdaoeth = registerconicdaoeth;
//# sourceMappingURL=conicdaoeth.js.map