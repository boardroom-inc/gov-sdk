"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerpoolpoolpooltogethereth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerpoolpoolpooltogethereth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'poolpoolpooltogethereth',
        name: 'Pool Pool',
        category: ['Product', 'Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'poolpool.pooltogether.eth',
                transports,
                cname: 'poolpoolpooltogethereth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/poolpoolpooltogethereth_SXLcNFE6r.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerpoolpoolpooltogethereth = registerpoolpoolpooltogethereth;
//# sourceMappingURL=poolpoolpooltogethereth.js.map