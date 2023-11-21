"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermutantsdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermutantsdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'mutantsdaoeth',
        name: 'MutantCats DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mutantsdao.eth',
                transports,
                cname: 'mutantsdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/mutantsdaoeth_ApHgmPtMB3.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermutantsdaoeth = registermutantsdaoeth;
//# sourceMappingURL=mutantsdaoeth.js.map