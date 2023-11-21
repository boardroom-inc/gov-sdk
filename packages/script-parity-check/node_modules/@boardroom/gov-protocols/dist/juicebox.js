"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJuicebox = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerJuicebox = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'juicebox';
    register({
        cname: cname,
        name: 'juicebox',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'jbdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('juicebox', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xaf28bcb48c40dbc86f52d459a6562f658fc94b1e', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/juicebox_VCdzVaM1K.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerJuicebox = registerJuicebox;
//# sourceMappingURL=juicebox.js.map