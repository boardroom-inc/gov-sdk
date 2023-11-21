"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registersismoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registersismoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'sismoeth',
        name: 'Sismo DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'sismo.eth',
                transports,
                cname: 'sismoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/sismoeth_S0Vzpz2ILw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registersismoeth = registersismoeth;
//# sourceMappingURL=sismoeth.js.map