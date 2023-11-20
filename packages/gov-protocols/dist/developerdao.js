"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDeveloperDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDeveloperDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'devdao';
    register({
        cname: cname,
        name: 'Developer DAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'devdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x7128f5ff32eD07Ce12E6a9deBE32BB40F9884b3C', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/developerdao_UopJ3eLrq.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDeveloperDAO = registerDeveloperDAO;
//# sourceMappingURL=developerdao.js.map