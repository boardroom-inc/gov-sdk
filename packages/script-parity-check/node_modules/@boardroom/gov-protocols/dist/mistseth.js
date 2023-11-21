"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermistseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermistseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'mistseth',
        name: 'mists',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mists.eth',
                transports,
                cname: 'mistseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/mistseth_DyjtTT0ZD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermistseth = registermistseth;
//# sourceMappingURL=mistseth.js.map