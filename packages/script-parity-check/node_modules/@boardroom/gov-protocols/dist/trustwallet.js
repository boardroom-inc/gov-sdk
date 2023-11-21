"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTrustwallet = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTrustwallet = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'trustwallet',
        name: 'Trust Wallet',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'trustwallet',
                transports,
                cname: 'trustwallet',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/trustwallet_Tfl2M0c2i.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTrustwallet = registerTrustwallet;
//# sourceMappingURL=trustwallet.js.map