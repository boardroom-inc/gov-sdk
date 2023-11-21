"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDcipeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDcipeth = (register, transports, snapshotApiKey) => {
    register({
        cname: 'dcipeth',
        name: 'DCIP',
        category: ['Investment', 'Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({ spaceName: 'dcip.eth', transports, cname: 'dcipeth', snapshotApiKey });
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/dcipeth_mZOTmBPfB.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDcipeth = registerDcipeth;
//# sourceMappingURL=dcipeth.js.map