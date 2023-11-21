"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registersharkdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registersharkdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'sharkdaoeth',
        name: 'SharkDAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'sharkdao.eth',
                transports,
                cname: 'sharkdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/sharkdaoeth_DMtPhO0D1L.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registersharkdaoeth = registersharkdaoeth;
//# sourceMappingURL=sharkdaoeth.js.map