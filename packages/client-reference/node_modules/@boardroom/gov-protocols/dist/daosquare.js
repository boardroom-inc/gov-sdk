"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDaoSquare = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDaoSquare = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'daosquare';
    register({
        cname: cname,
        name: 'DAOSquare',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'daosquare',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/daosquare_qqI9XTNtt.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDaoSquare = registerDaoSquare;
//# sourceMappingURL=daosquare.js.map