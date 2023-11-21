"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMagicappstoreeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMagicappstoreeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'magicappstoreeth',
        name: 'Magic Square',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'magicappstore.eth',
                transports,
                cname: 'magicappstoreeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/magicappstoreeth_M7A1VJXox.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMagicappstoreeth = registerMagicappstoreeth;
//# sourceMappingURL=magicappstoreeth.js.map