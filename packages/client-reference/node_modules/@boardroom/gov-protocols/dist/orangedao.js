"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOrangeDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerOrangeDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'orangedao';
    register({
        cname: cname,
        name: 'OrangeDAO',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'orangedaoxyz.eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/orangedao_jTAAD3oh1.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerOrangeDAO = registerOrangeDAO;
//# sourceMappingURL=orangedao.js.map