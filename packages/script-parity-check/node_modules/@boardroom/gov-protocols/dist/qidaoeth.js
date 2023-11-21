"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerQidaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerQidaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'qidaoeth',
        name: 'Qi Dao | Mai.Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'qidao.eth',
                transports,
                cname: 'qidaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/qidaoeth_p9b4OhcRw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerQidaoeth = registerQidaoeth;
//# sourceMappingURL=qidaoeth.js.map