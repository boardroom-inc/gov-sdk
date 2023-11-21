"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPleasrDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPleasrDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'pleasrdao';
    register({
        cname: cname,
        name: 'PleasrDAO',
        category: ['Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'pleasrdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xF5c27c6fE782cbB5c85989ea3e75754748153459', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pleasrdao_9HNNiwsSo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPleasrDAO = registerPleasrDAO;
//# sourceMappingURL=pleasrdao.js.map