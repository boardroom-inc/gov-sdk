"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBabyDogeArmy = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBabyDogeArmy = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'babydogearmy';
    register({
        cname: cname,
        name: 'Baby Doge Army',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'babydogearmy.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const snapshotTwo = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'babydogevote.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('baby-doge-coin', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('proposals', snapshotTwo, 'archive');
            adapters.implement('vote', snapshotTwo, 'archive');
            adapters.implement('votePower', snapshotTwo, 'archive');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/babydogearmy_WOagReXeG.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBabyDogeArmy = registerBabyDogeArmy;
//# sourceMappingURL=babydogearmy.js.map