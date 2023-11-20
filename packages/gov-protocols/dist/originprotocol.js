"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOriginProtocol = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerOriginProtocol = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'originprotocol';
    register({
        cname: cname,
        name: 'originprotocol',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'origingov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('origin-protocol', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/originprotocol_csWD9YWjN.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerOriginProtocol = registerOriginProtocol;
//# sourceMappingURL=originprotocol.js.map