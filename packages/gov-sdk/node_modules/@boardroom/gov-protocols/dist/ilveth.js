"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerilveth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerilveth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'ilveth',
        name: 'Illuvinati Council',
        category: ['Media', 'Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ilv.eth',
                transports,
                cname: 'ilveth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/ilveth_M5sl1L_2G7.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerilveth = registerilveth;
//# sourceMappingURL=ilveth.js.map