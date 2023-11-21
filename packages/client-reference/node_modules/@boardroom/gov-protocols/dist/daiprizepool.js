"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDaiPrizePool = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDaiPrizePool = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'daiprizepool';
    register({
        cname: cname,
        name: 'dai-prize-pool',
        category: ['Uncategorized'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dai-prize-pool',
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
                                url: 'https://raw.githubusercontent.com/boardroom-inc/protocol-Info/main/protocols/dai-prize-pool/logo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDaiPrizePool = registerDaiPrizePool;
//# sourceMappingURL=daiprizepool.js.map