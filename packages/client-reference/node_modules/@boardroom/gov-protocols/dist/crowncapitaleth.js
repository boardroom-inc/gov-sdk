"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registercrowncapitaleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registercrowncapitaleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'crowncapitaleth',
        name: 'Crown Capital',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'crowncapital.eth',
                transports,
                cname: 'crowncapitaleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/crowncapitaleth_3eVLbB1--.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registercrowncapitaleth = registercrowncapitaleth;
//# sourceMappingURL=crowncapitaleth.js.map