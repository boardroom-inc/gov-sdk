"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registeradidaseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registeradidaseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'adidaseth',
        name: 'adidas',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'adidas.eth',
                transports,
                cname: 'adidaseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/adidaseth_wO0h_rqqP7.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registeradidaseth = registeradidaseth;
//# sourceMappingURL=adidaseth.js.map