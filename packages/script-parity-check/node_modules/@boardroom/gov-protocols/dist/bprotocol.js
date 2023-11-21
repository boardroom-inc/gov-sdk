"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBProtocol = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBProtocol = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'bprotocol';
    register({
        cname: cname,
        name: 'B.Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'bpro.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('b-protocol', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x63D7642F14f012063764BAc5aaB1CAF6c0771164', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/bprotocol_92nfLdIfo4.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBProtocol = registerBProtocol;
//# sourceMappingURL=bprotocol.js.map