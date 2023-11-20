"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYounghwangeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerYounghwangeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'younghwangeth',
        name: 'Alatelecoin DAO',
        category: ['Social', 'Media'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'younghwang.eth',
                transports,
                cname: 'younghwangeth',
                snapshotApiKey,
                boardroomAPIKey
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/younghwangeth_RmZ61zhHP.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerYounghwangeth = registerYounghwangeth;
//# sourceMappingURL=younghwangeth.js.map