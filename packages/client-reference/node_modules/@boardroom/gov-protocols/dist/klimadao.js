"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKlimaDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKlimaDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'klimadao';
    register({
        cname: cname,
        name: 'Klima DAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'klimadao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('klima-dao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x7Dd4f0B986F032A44F913BF92c9e8b7c17D77aD7', 137, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/klimadao_-8hKBu9Sl.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerKlimaDAO = registerKlimaDAO;
//# sourceMappingURL=klimadao.js.map