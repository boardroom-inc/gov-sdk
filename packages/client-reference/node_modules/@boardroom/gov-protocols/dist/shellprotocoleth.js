"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerShellprotocoleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerShellprotocoleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'shellprotocoleth',
        name: 'Shell Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'shellprotocol.eth',
                transports,
                cname: 'shellprotocoleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/shellprotocoleth_z0BKXa4WU.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerShellprotocoleth = registerShellprotocoleth;
//# sourceMappingURL=shellprotocoleth.js.map