"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDecentralGames = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDecentralGames = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'decentralgames';
    register({
        cname: cname,
        name: 'Decentral Games',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'decentralgames.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('decentral-games', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x7A61A0Ed364E599Ae4748D1EbE74bf236Dd27B09', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/decentralgames_LIUDA7nTo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDecentralGames = registerDecentralGames;
//# sourceMappingURL=decentral-games.js.map