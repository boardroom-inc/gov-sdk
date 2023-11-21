"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNation3 = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerNation3 = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'nation3',
        name: 'Nation',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'nation3.eth',
                transports,
                cname: 'nation3',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/nation3_ZIAsg3T-X.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerNation3 = registerNation3;
//# sourceMappingURL=nation3.js.map