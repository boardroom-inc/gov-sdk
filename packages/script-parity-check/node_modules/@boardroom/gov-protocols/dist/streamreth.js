"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerstreamreth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerstreamreth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'streamreth',
        name: 'Streamr',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'streamr.eth',
                transports,
                cname: 'streamreth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/streamreth_AYuzexLbz.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerstreamreth = registerstreamreth;
//# sourceMappingURL=streamreth.js.map