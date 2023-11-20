"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergrayboyseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergrayboyseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'grayboyseth',
        name: 'The Mothership DAO (Gray Boys)',
        category: ['Collector', 'Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'grayboys.eth',
                transports,
                cname: 'grayboyseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/grayboyseth_k9lIcSOhn.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergrayboyseth = registergrayboyseth;
//# sourceMappingURL=grayboyseth.js.map