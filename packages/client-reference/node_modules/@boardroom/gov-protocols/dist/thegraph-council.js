"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheGraphCouncil = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTheGraphCouncil = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'thegraphcouncil';
    register({
        cname: cname,
        name: 'TheGraphCouncil',
        category: ['Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'council.graphprotocol.eth',
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
exports.registerTheGraphCouncil = registerTheGraphCouncil;
//# sourceMappingURL=thegraph-council.js.map