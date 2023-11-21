"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYup = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerYup = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'yup';
    register({
        cname: cname,
        name: 'Yup',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'yup.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('yup', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xbd5224f66D5ce49a8Afefc14a76248D158D14c6F', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/yup_IBKoLe9om.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerYup = registerYup;
//# sourceMappingURL=yup.js.map