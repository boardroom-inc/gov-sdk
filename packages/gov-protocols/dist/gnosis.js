"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGnosis = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGnosis = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'gnosis';
    register({
        cname: cname,
        name: 'Gnosis',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gnosis.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('gnosis', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xeC83f750adfe0e52A8b0DbA6eeB6be5Ba0beE535', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gnosis_1m15yFs5e.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGnosis = registerGnosis;
//# sourceMappingURL=gnosis.js.map