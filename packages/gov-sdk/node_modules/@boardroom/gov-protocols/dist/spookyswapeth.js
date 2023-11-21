"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSpookyswapeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSpookyswapeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'spookyswapeth',
        name: 'SpookySwap',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'spookyswap.eth',
                transports,
                cname: 'spookyswapeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/spookyswapeth_VgW78-3D3.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSpookyswapeth = registerSpookyswapeth;
//# sourceMappingURL=spookyswapeth.js.map