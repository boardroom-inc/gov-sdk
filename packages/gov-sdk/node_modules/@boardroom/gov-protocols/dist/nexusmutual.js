"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNexusMutual = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerNexusMutual = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'nexusmutual';
    register({
        cname: cname,
        name: 'Nexus Mutual Grants',
        category: ['Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'community.nexusmutual.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('nxm', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x586b9b2F8010b284A0197f392156f1A7Eb5e86e9', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/nexusmutual_ugfumNyZ1C.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerNexusMutual = registerNexusMutual;
//# sourceMappingURL=nexusmutual.js.map