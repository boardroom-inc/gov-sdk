"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApecoin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerApecoin = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'apecoin';
    register({
        cname: cname,
        name: 'ApeCoin',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'apecoin.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('apecoin', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/apecoin_0l9dGa5CMw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerApecoin = registerApecoin;
//# sourceMappingURL=apecoin.js.map