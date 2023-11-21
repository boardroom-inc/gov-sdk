"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBancor = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBancor = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'bancor';
    register({
        cname: cname,
        name: 'Bancor',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'bancornetwork.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('bancor-governance-token', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bancor_bT5tQ5AJfC.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBancor = registerBancor;
//# sourceMappingURL=bancor.js.map