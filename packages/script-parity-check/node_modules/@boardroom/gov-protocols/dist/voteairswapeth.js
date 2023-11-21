"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registervoteairswapeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registervoteairswapeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'voteairswapeth',
        name: 'AirSwap',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'vote.airswap.eth',
                transports,
                cname: 'voteairswapeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/voteairswapeth_xtg7TCWNz.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registervoteairswapeth = registervoteairswapeth;
//# sourceMappingURL=voteairswapeth.js.map