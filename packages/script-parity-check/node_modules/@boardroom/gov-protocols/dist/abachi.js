"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAbachi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAbachi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'abachi';
    register({
        cname: cname,
        name: 'Abachi',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'abachi.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('abachi-2', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x6FcE4c6CDd8C4e6C7486553D09BdD9aEE61cF095', 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/abachi_QMqu2wkfu.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAbachi = registerAbachi;
//# sourceMappingURL=abachi.js.map