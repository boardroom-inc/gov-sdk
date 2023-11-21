"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSpiralDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSpiralDao = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'spiraldao',
        name: 'SpiralDao',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'spiralgov.eth',
                transports,
                cname: 'spiraldao',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/spiralgov_tNVdUqIdy.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSpiralDao = registerSpiralDao;
//# sourceMappingURL=spiraldao.js.map