"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRally = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRally = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'rally';
    register({
        cname: cname,
        name: 'Rally',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'rallygov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('rally-2', transports);
            const treasury = new gov_adapters_1.CovalentAdapter(['0x3b66890289366175c360c1f0e1bafae06276ba03', '0xAb9C84ad7f8B1356A370d367234fe215DF979Ec2'], 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/rallygov_3fZLn803e.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRally = registerRally;
//# sourceMappingURL=rally.js.map