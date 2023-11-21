"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAlchemist = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAlchemist = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'alchemist';
    register({
        cname: 'alchemist',
        name: 'Alchemist',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'alchemistcoin.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('alchemist', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x1c428A75181Bc25509aF3A5B7FAEE97b4B6d3562', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/alchemistcoin_1KPWgKiws.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAlchemist = registerAlchemist;
//# sourceMappingURL=alchemist.js.map