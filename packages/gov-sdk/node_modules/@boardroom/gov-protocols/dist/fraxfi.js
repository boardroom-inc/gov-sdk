"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFraxFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerFraxFi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'fraxfi';
    register({
        cname: cname,
        name: 'Frax Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'frax.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('frax', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x9AA7Db8E488eE3ffCC9CdFD4f2EaECC8ABeDCB48', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/fraxdao_UnCc5hobd.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerFraxFi = registerFraxFi;
//# sourceMappingURL=fraxfi.js.map