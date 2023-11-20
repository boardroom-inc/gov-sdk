"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerpopcornsnapshoteth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerpopcornsnapshoteth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'popcornsnapshoteth',
        name: 'Popcorn',
        category: ['Protocol', 'Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'popcorn-snapshot.eth',
                transports,
                cname: 'popcornsnapshoteth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/popcornsnapshoteth_PAmkfGeEQP.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerpopcornsnapshoteth = registerpopcornsnapshoteth;
//# sourceMappingURL=popcornsnapshoteth.js.map