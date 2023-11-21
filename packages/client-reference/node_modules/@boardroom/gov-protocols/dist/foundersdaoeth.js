"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerfoundersdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerfoundersdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'foundersdaoeth',
        name: 'Founders DAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'foundersdao.eth',
                transports,
                cname: 'foundersdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/foundersdaoeth_4MITpdIvt.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerfoundersdaoeth = registerfoundersdaoeth;
//# sourceMappingURL=foundersdaoeth.js.map