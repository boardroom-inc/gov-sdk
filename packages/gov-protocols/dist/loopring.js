"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLoopring = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLoopring = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'loopring';
    register({
        cname: cname,
        name: 'Loopring',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'loopringdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/loopringdao.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLoopring = registerLoopring;
//# sourceMappingURL=loopring.js.map