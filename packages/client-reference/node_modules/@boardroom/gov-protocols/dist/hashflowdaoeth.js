"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerhashflowdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerhashflowdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'hashflowdaoeth',
        name: 'Hashflow',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'hashflowdao.eth',
                transports,
                cname: 'hashflowdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/hashflowdaoeth_wP64x0tHs.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerhashflowdaoeth = registerhashflowdaoeth;
//# sourceMappingURL=hashflowdaoeth.js.map