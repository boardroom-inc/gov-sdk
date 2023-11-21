"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registervotevitadaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registervotevitadaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'votevitadaoeth',
        name: 'VitaDAO',
        category: ['Collector', 'Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'vote.vitadao.eth',
                transports,
                cname: 'votevitadaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/votevitadaoeth_HV0DAZRVD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registervotevitadaoeth = registervotevitadaoeth;
//# sourceMappingURL=votevitadaoeth.js.map