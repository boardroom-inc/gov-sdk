"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermasknetworketh = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermasknetworketh = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'masknetworketh',
        name: 'MASK',
        category: ['Service', 'Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'masknetwork.eth',
                transports,
                cname: 'masknetworketh',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/masknetworketh_EOHd-Ki8kp.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermasknetworketh = registermasknetworketh;
//# sourceMappingURL=masknetworketh.js.map