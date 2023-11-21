"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register10b57e6da0eth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const register10b57e6da0eth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: '10b57e6da0eth',
        name: '10b57e6da0',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: '10b57e6da0.eth',
                transports,
                cname: '10b57e6da0eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/10b57e6da0eth_t-IjtrJip.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.register10b57e6da0eth = register10b57e6da0eth;
//# sourceMappingURL=10b57e6da0eth.js.map