"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMetaFactory = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMetaFactory = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'metafactory';
    register({
        cname: cname,
        name: 'MetaFactory',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'metafactory.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('robot', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/metafactorygov_Zc_xJcNj2.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMetaFactory = registerMetaFactory;
//# sourceMappingURL=metafactory.js.map