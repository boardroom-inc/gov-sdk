"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registercre8reth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registercre8reth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'cre8reth',
        name: 'CRE8R DAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cre8r.eth',
                transports,
                cname: 'cre8reth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/cre8reth_6Gos90BG2.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registercre8reth = registercre8reth;
//# sourceMappingURL=cre8reth.js.map