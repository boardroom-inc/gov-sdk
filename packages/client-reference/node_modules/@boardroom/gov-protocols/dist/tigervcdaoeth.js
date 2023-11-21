"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registertigervcdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registertigervcdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'tigervcdaoeth',
        name: 'Tiger VC DAO',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tigervc-dao.eth',
                transports,
                cname: 'tigervcdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/tigervcdaoeth_ou3jwsJJwH.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registertigervcdaoeth = registertigervcdaoeth;
//# sourceMappingURL=tigervcdaoeth.js.map