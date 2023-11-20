"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registeryieldguildeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registeryieldguildeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'yieldguildeth',
        name: 'Yield Guild Games',
        category: ['Product', 'Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'yieldguild.eth',
                transports,
                cname: 'yieldguildeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/yieldguildeth_uhD1q0wVO0.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registeryieldguildeth = registeryieldguildeth;
//# sourceMappingURL=yieldguildeth.js.map