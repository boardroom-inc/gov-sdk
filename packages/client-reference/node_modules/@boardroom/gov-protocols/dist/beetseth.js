"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBeetseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBeetseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'beetseth',
        name: 'BeethovenX',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'beets.eth',
                transports,
                cname: 'beetseth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/beetseth_tpGdHqJuD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBeetseth = registerBeetseth;
//# sourceMappingURL=beetseth.js.map