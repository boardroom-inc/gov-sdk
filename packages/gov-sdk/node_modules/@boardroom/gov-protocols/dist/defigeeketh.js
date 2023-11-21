"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerdefigeeketh = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerdefigeeketh = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'defigeeketh',
        name: 'DeFiGeek Community',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'defigeek.eth',
                transports,
                cname: 'defigeeketh',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/defigeeketh_Qry1XiPNk.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerdefigeeketh = registerdefigeeketh;
//# sourceMappingURL=defigeeketh.js.map