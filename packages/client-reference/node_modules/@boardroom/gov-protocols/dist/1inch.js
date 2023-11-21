"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register1inch = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const register1inch = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = '1inch';
    register({
        cname: cname,
        name: '1inch',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: '1inch.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('1inch', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x7951c7ef839e26F63DA87a42C9a87986507f1c07', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/1inch_STtp_koiW.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.register1inch = register1inch;
//# sourceMappingURL=1inch.js.map