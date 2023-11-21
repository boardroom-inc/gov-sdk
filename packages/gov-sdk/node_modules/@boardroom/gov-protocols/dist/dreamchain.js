"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDreamChain = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDreamChain = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'dreamchain';
    register({
        cname: cname,
        name: 'Dream Chain',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dreamchaindao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('dream-token', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x3c91ef887c2958D2eD76275c8f4089a0FD7d4Ff3', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dreamchain_eKGnsc2tb.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDreamChain = registerDreamChain;
//# sourceMappingURL=dreamchain.js.map