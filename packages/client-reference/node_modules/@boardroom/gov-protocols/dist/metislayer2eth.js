"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMetislayer2eth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMetislayer2eth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'metislayer2eth',
        name: 'MetisDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'metislayer2.eth',
                transports,
                cname: 'metislayer2eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/metislayer2eth_qsZe9-gg6.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMetislayer2eth = registerMetislayer2eth;
//# sourceMappingURL=metislayer2eth.js.map