"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIndexCoop = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerIndexCoop = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'indexCoop';
    register({
        cname: cname,
        name: 'Index',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'index-coop.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('index-cooperative', transports);
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter('0x9467cfADC9DE245010dF95Ec6a585A506A8ad5FC', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/indexcoop_qVj_Jk-Lb.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerIndexCoop = registerIndexCoop;
//# sourceMappingURL=index-coop.js.map