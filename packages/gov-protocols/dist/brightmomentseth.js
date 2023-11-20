"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbrightmomentseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbrightmomentseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'brightmomentseth',
        name: 'Bright Moments',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'brightmoments.eth',
                transports,
                cname: 'brightmomentseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/brightmomentseth_SXbNPenKq.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbrightmomentseth = registerbrightmomentseth;
//# sourceMappingURL=brightmomentseth.js.map