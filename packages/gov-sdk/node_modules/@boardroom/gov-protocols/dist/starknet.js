"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerstarknet = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerstarknet = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'starkneteth',
        name: 'StarkNet',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'starknet.eth',
                transports,
                cname: 'starkneteth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/starknet_YQKifDcT3.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerstarknet = registerstarknet;
//# sourceMappingURL=starknet.js.map