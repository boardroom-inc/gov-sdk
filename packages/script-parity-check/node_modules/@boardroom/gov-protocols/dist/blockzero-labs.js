"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlockzeroLabs = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBlockzeroLabs = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'blockzerolabs';
    register({
        cname: cname,
        name: 'Blockzero Labs',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'blockzerolabs.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('xio', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x5089722613C2cCEe071C39C59e9889641f435F15', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/blockzerolabs_CaM1c422Qx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBlockzeroLabs = registerBlockzeroLabs;
//# sourceMappingURL=blockzero-labs.js.map