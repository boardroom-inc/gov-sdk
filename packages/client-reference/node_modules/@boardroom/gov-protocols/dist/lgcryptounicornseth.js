"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLgcryptounicornseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLgcryptounicornseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'lgcryptounicornseth',
        name: 'Crypto Unicorns',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'lgcryptounicorns.eth',
                transports,
                cname: 'lgcryptounicornseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/lgcryptounicornseth_BaCKAKqUFu.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLgcryptounicornseth = registerLgcryptounicornseth;
//# sourceMappingURL=lgcryptounicornseth.js.map