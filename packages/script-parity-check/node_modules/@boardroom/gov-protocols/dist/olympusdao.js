"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOlympusDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerOlympusDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'olympusdao';
    register({
        cname: cname,
        name: 'Olympus DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'olympusdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('olympus', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x9A315BdF513367C0377FB36545857d12e85813Ef', 1, transports);
            adapters.implement('treasury', treasury);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/olympusdao_oEX7rT81i.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerOlympusDAO = registerOlympusDAO;
//# sourceMappingURL=olympusdao.js.map