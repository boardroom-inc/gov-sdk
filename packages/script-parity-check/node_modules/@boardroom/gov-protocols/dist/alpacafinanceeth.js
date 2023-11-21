"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAlpacafinanceeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAlpacafinanceeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'alpacafinanceeth',
        name: 'Alpaca Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'alpacafinance.eth',
                transports,
                cname: 'alpacafinanceeth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/alpacafinanceeth_hlKoLA5h8.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAlpacafinanceeth = registerAlpacafinanceeth;
//# sourceMappingURL=alpacafinanceeth.js.map