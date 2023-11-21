"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPhonon = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPhonon = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'phonon';
    register({
        cname: cname,
        name: 'Phonon',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'phonon.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('phonon-dao', transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/phonon_7QliPRILo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPhonon = registerPhonon;
//# sourceMappingURL=phonon.js.map