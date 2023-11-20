"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerstakingidlefinanceeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerstakingidlefinanceeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'stakingidlefinanceeth',
        name: 'Idle DAO (stkIDLE holders)',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'staking.idlefinance.eth',
                transports,
                cname: 'stakingidlefinanceeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/stakingidlefinanceeth_yRuwUzZdHv.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerstakingidlefinanceeth = registerstakingidlefinanceeth;
//# sourceMappingURL=stakingidlefinanceeth.js.map