"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerofficialoceandaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerofficialoceandaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'officialoceandaoeth',
        name: 'OceanDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'officialoceandao.eth',
                transports,
                cname: 'officialoceandaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/officialoceandaoeth_wtFNtPWO1y.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerofficialoceandaoeth = registerofficialoceandaoeth;
//# sourceMappingURL=officialoceandaoeth.js.map