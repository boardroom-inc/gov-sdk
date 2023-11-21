"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registervareneth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registervareneth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'vareneth',
        name: 'Varen',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'varen.eth',
                transports,
                cname: 'vareneth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/vareneth_9cXzLaHVXD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registervareneth = registervareneth;
//# sourceMappingURL=vareneth.js.map