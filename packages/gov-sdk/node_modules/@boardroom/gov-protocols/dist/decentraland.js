"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDecentraland = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDecentraland = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'decentraland';
    register({
        cname: cname,
        name: 'Decentraland',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'snapshot.dcl.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('decentraland', transports);
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x89214c8Ca9A49E60a3bfa8e00544F384C93719b1',
                '0x9A6ebE7E2a7722F8200d0ffB63a1F6406A0d7dce',
                '0xB08E3e7cc815213304d884C88cA476ebC50EaAB2',
            ], 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/decentraland_OnKYXvXIV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDecentraland = registerDecentraland;
//# sourceMappingURL=decentraland.js.map