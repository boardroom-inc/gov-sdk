"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSafeDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSafeDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'safedao';
    register({
        cname: cname,
        name: 'SafeDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'safe.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/safe_yyHjpiaIV.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSafeDAO = registerSafeDAO;
//# sourceMappingURL=safedao.js.map