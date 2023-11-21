"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLidoDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLidoDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'lido';
    register({
        cname: cname,
        name: 'Lido DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'lido-snapshot.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('lido-dao', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x3e40D73EB977Dc6a537aF587D48316feE66E9C8c', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lidofinance_T9vVHHijl.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLidoDAO = registerLidoDAO;
//# sourceMappingURL=lido.js.map