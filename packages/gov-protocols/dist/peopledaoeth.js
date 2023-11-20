"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerpeopledaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerpeopledaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'peopledaoeth',
        name: 'PeopleDAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'people-dao.eth',
                transports,
                cname: 'peopledaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/peopledaoeth_ingMr2z4U.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerpeopledaoeth = registerpeopledaoeth;
//# sourceMappingURL=peopledaoeth.js.map