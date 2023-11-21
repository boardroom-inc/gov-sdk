"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSynthetix = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSynthetix = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'synthetix';
    register({
        cname: cname,
        name: 'Synthetix',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'snxgov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('havven', transports);
            // Treasury addresses sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0xEb3107117FEAd7de89Cd14D463D340A2E6917769',
                '0x86626E1BbBd0ce95ED52e0C5E19f371a6640B591',
                '0x99F4176EE457afedFfCB1839c7aB7A030a5e4A92',
            ], 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/synthetix_59Vn7f6sx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSynthetix = registerSynthetix;
//# sourceMappingURL=synthetix.js.map