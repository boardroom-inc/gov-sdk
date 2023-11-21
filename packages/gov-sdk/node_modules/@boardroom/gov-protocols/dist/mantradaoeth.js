"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermantradaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermantradaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'mantradaoeth',
        name: 'MANTRA',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mantra-dao.eth',
                transports,
                cname: 'mantradaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/mantradaoeth_TmbPuDapx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermantradaoeth = registermantradaoeth;
//# sourceMappingURL=mantradaoeth.js.map