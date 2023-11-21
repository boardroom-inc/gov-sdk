"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGoodkarma = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGoodkarma = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'goodkarma';
    register({
        cname: cname,
        name: 'Good Karma DAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'goodkarmarecords.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('karma-dao', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/goodkarmadao_cwSIKuaos.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGoodkarma = registerGoodkarma;
//# sourceMappingURL=goodkarma.js.map