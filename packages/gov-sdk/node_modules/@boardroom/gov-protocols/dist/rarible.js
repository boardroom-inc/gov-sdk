"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRarible = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRarible = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'rarible';
    register({
        cname: cname,
        name: 'Rarible',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'rarible.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('rarible', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xFDfF6b56CcE39482032b27140252FF4F16432785', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/rarible_p-5xJNWzh.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRarible = registerRarible;
//# sourceMappingURL=rarible.js.map