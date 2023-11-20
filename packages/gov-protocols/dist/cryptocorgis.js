"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCryptoCorgis = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCryptoCorgis = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'cryptocorgis';
    register({
        cname: cname,
        name: 'CryptoCorgis',
        category: ['Social'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'crypto-corgis.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/cryptocorgis_OP_nnqckf.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCryptoCorgis = registerCryptoCorgis;
//# sourceMappingURL=cryptocorgis.js.map