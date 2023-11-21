"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSaddleFinance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSaddleFinance = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'saddlefi';
    register({
        cname: cname,
        name: 'saddlefi',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'saddlefinance.eth',
                transports,
                cname,
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/saddlefinance_PMdej0g4lM.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSaddleFinance = registerSaddleFinance;
//# sourceMappingURL=saddlefi.js.map