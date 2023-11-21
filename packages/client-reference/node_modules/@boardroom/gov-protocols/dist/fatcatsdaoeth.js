"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerfatcatsdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerfatcatsdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'fatcatsdaoeth',
        name: 'Fat Cats ',
        category: ['Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'fatcatsdao.eth',
                transports,
                cname: 'fatcatsdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/fatcatsdaoeth_RotZ4tGzdM.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerfatcatsdaoeth = registerfatcatsdaoeth;
//# sourceMappingURL=fatcatsdaoeth.js.map