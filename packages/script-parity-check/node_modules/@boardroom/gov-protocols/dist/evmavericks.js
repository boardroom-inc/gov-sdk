"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEVMavericks = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerEVMavericks = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'evmavericks';
    register({
        cname: cname,
        name: 'EVMavericks',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'evmaverick.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x7dDAA898D33D7aB252Ea5F89f96717c47B2fEE6e', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/evmavericks_fFy9JLLqCA.png',
                            },
                        ],
                    };
                },
            });
            adapters.implement('treasury', treasury);
        },
    });
};
exports.registerEVMavericks = registerEVMavericks;
//# sourceMappingURL=evmavericks.js.map