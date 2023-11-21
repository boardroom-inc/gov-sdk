"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerzechubdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerzechubdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'zechubdaoeth',
        name: 'ZecHub',
        category: ["Media"],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'zechubdao.eth',
                transports,
                cname: 'zechubdaoeth',
                chainId: 1,
                snapshotApiKey,
                boardroomAPIKey
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/zechubdaoeth_Jrzla0eMA.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerzechubdaoeth = registerzechubdaoeth;
//# sourceMappingURL=zechubdaoeth.js.map