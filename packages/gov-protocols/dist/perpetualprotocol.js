"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPerpetualProtocol = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPerpetualProtocol = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'perpetualprotocol';
    register({
        cname: cname,
        name: 'Perpetual Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'vote-perp.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('perpetual-protocol', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xd374225abb84dca94e121f0b8a06b93e39ad7a99', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/perpetualprotocol_XnkDFBYrW.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPerpetualProtocol = registerPerpetualProtocol;
//# sourceMappingURL=perpetualprotocol.js.map