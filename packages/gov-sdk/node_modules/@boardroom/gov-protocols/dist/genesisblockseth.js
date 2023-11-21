"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergenesisblockseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergenesisblockseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'genesisblockseth',
        name: 'Genesis Blocks',
        category: ['Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'genesisblocks.eth',
                transports,
                cname: 'genesisblockseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/genesisblockseth_LbErUqrDoR.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergenesisblockseth = registergenesisblockseth;
//# sourceMappingURL=genesisblockseth.js.map