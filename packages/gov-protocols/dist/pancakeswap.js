"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPancakeSwap = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPancakeSwap = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'pancakeswap';
    register({
        cname: cname,
        name: 'PancakeSwap',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cakevote.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('pancakeswap-token', transports);
            // Add treasury address 0x7122C91049511b58A14Ce2CE10f1aCF318cc51d0 BSC chain use Id 56
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pancakeswap_pCVw-YoyS.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPancakeSwap = registerPancakeSwap;
//# sourceMappingURL=pancakeswap.js.map