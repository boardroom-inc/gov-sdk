"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLootDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLootDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'lootdao';
    register({
        cname: cname,
        name: 'LootDAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'loot-dao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x8cFDF9E9f7EA8c0871025318407A6f1Fbc5d5a18', 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lootdao_XCuzOwhIF.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLootDAO = registerLootDAO;
//# sourceMappingURL=lootdao.js.map