"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerseizerdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerseizerdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'seizerdaoeth',
        name: 'SeizerDAO',
        category: ['Collector', 'Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'seizerdao.eth',
                transports,
                cname: 'seizerdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/seizerdaoeth_MJTYoZ_bvN.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerseizerdaoeth = registerseizerdaoeth;
//# sourceMappingURL=seizerdaoeth.js.map