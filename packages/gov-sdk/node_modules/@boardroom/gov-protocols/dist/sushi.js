"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSushi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSushi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'sushi';
    register({
        cname: cname,
        name: 'Sushi',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'sushigov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('sushi', transports);
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter('0xe94b5eec1fa96ceecbd33ef5baa8d00e4493f4f3', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/sushi_3Gzqoe3p_.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSushi = registerSushi;
//# sourceMappingURL=sushi.js.map