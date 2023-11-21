"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPrimeDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPrimeDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'primedao';
    register({
        cname: cname,
        name: 'PrimeDAO',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'primexyz.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('prime', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x567d220B0169836cBF351DF70A9c517096ec9De7', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/prime_TBTCMkhrH.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPrimeDAO = registerPrimeDAO;
//# sourceMappingURL=primedao.js.map