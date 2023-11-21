"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJoegovernanceeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerJoegovernanceeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'joegovernanceeth',
        name: 'Trader Joe',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'joegovernance.eth',
                transports,
                cname: 'joegovernanceeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/joegovernanceeth_CWdM6K12W.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerJoegovernanceeth = registerJoegovernanceeth;
//# sourceMappingURL=joegovernanceeth.js.map