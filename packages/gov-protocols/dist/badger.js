"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBadgerDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBadgerDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'badgerdao';
    register({
        cname: cname,
        name: 'BadgerDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'badgerdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('badger-dao', transports);
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter('0x4441776e6a5d61fa024a5117bfc26b953ad1f425', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/badgerdao_DnH6ltyzy7.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBadgerDAO = registerBadgerDAO;
//# sourceMappingURL=badger.js.map