"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHectordaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerHectordaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'hectordaoeth',
        name: 'Hector Network',
        category: ['Protocol', 'Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'hectordao.eth',
                transports,
                cname: 'hectordaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/hectordaoeth_300Ul9plw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerHectordaoeth = registerHectordaoeth;
//# sourceMappingURL=hectordaoeth.js.map