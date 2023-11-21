"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registeropiumprotocoleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registeropiumprotocoleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'opiumprotocoleth',
        name: 'Opium Network',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'opiumprotocol.eth',
                transports,
                cname: 'opiumprotocoleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/opiumprotocoleth_sXjoRAGWje.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registeropiumprotocoleth = registeropiumprotocoleth;
//# sourceMappingURL=opiumprotocoleth.js.map