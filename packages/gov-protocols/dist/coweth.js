"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registercoweth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registercoweth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'coweth',
        name: 'CoW DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cow.eth',
                transports,
                cname: 'coweth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/coweth_ak7Xz5KYb2.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registercoweth = registercoweth;
//# sourceMappingURL=coweth.js.map