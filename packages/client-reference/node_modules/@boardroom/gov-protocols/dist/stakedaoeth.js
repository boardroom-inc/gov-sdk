"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerstakedaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerstakedaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'stakedaoeth',
        name: 'Stake DAO',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'stakedao.eth',
                transports,
                cname: 'stakedaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/stakedaoeth_s5R30GIKlh.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerstakedaoeth = registerstakedaoeth;
//# sourceMappingURL=stakedaoeth.js.map