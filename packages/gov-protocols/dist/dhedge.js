"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDHedge = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDHedge = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'dhedge';
    register({
        cname: cname,
        name: 'dHEDGE',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gov.dhedge.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('dhedge-dao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xB76E40277B79B78dFa954CBEc863D0e4Fd0656ca', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dhedge_GowBCK9XV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDHedge = registerDHedge;
//# sourceMappingURL=dhedge.js.map