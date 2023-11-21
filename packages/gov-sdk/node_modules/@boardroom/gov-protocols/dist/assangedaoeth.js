"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerassangedaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerassangedaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'assangedaoeth',
        name: 'AssangeDAO',
        category: ['Service', 'Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'assangedao.eth',
                transports,
                cname: 'assangedaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/assangedaoeth_iF6kIkG8z.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerassangedaoeth = registerassangedaoeth;
//# sourceMappingURL=assangedaoeth.js.map