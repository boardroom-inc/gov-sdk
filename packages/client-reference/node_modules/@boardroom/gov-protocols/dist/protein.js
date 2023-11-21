"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProtein = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerProtein = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'protein';
    register({
        cname: cname,
        name: 'Protein',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'proteincommunity.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/protein_c74tv1JKa.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerProtein = registerProtein;
//# sourceMappingURL=protein.js.map