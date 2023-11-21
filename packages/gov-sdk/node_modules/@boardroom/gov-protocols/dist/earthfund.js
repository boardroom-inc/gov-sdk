"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEarthfund = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerEarthfund = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'earthfund';
    register({
        cname: cname,
        name: 'EarthFund',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'earthfund.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('earthfund', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xB59d20eEB15F814AD5e995E9B0F2522AF819203c', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/earthfund_0S3dMANHI.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerEarthfund = registerEarthfund;
//# sourceMappingURL=earthfund.js.map