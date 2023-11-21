"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerblackpoolhqeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerblackpoolhqeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'blackpoolhqeth',
        name: 'blackpoolhq.eth',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'blackpoolhq.eth',
                transports,
                cname: 'blackpoolhqeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/blackpool_hq_OS3tAOTyI.jpeg',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerblackpoolhqeth = registerblackpoolhqeth;
//# sourceMappingURL=blackpoolhqeth.js.map