"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerkuiqianeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerkuiqianeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'kuiqianeth',
        name: 'KuiQian亏钱俱乐部',
        category: ['Social', 'Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'kuiqian.eth',
                transports,
                cname: 'kuiqianeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/kuiqianeth_a0T5tQeB4.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerkuiqianeth = registerkuiqianeth;
//# sourceMappingURL=kuiqianeth.js.map