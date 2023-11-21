"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerkuwaoracleeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerkuwaoracleeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'kuwaoracleeth',
        name: 'Kuwa Oracle',
        category: ['Protocol'],
        // Adding a comment for testing purposes with a new build
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'kuwaoracle.eth',
                transports,
                cname: 'kuwaoracleeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-05/kuwaoracleeth_irf6Td4lG.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerkuwaoracleeth = registerkuwaoracleeth;
//# sourceMappingURL=kuwaoracleeth.js.map