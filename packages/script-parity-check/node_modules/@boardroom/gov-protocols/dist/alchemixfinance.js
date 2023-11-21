"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAlchemixFinance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAlchemixFinance = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'alchemixfinance';
    register({
        cname: cname,
        name: 'Alchemix Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'alchemixstakers.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('alchemix', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x8392F6669292fA56123F71949B52d883aE57e225', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/alchemix_SWNRvDpgM_.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAlchemixFinance = registerAlchemixFinance;
//# sourceMappingURL=alchemixfinance.js.map