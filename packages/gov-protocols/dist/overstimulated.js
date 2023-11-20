"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerOverstimultedDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerOverstimultedDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'oversmdao';
    register({
        cname: cname,
        name: 'Overstimulated DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'overstimulated.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x800b7EDD31E46FA3a2900DaCBDa7f7067aF3d917', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/overstimulated_2m-UQlz4h.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerOverstimultedDAO = registerOverstimultedDAO;
//# sourceMappingURL=overstimulated.js.map