"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTokenlon = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTokenlon = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'tokenlon';
    register({
        cname: cname,
        name: 'Tokenlon',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tokenlon.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('tokenlon', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/tokenlon_F7GBoSaXF.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTokenlon = registerTokenlon;
//# sourceMappingURL=tokenlon.js.map