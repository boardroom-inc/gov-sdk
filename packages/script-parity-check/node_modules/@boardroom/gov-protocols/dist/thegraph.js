"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheGraph = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTheGraph = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'graphprotocol';
    register({
        cname: cname,
        name: 'TheGraph',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'graphprotocol.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('the-graph', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/thegraphcouncil_ugQZg_Nbg.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTheGraph = registerTheGraph;
//# sourceMappingURL=thegraph.js.map