"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCredmark = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCredmark = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'credmark';
    register({
        cname: cname,
        name: 'Credmark',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'credmarkhq.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x414709Bd112d006cBB85Be21A9E19bF9bCe8657E', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/credmark_gJcyiCsNX.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCredmark = registerCredmark;
//# sourceMappingURL=credmark.js.map