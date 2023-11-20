"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerthegurudaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerthegurudaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'thegurudaoeth',
        name: ' GuruDAO Bootstrap Phase',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'thegurudao.eth',
                transports,
                cname: 'thegurudaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/thegurudaoeth_5udDYMJUeD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerthegurudaoeth = registerthegurudaoeth;
//# sourceMappingURL=thegurudaoeth.js.map