"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRadiantcapitaleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRadiantcapitaleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'radiantcapitaleth',
        name: 'Radiant Capital',
        category: ['Protocol', 'Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'radiantcapital.eth',
                transports,
                cname: 'radiantcapitaleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/radiantcapitaleth_yWbqfXwtD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRadiantcapitaleth = registerRadiantcapitaleth;
//# sourceMappingURL=radiantcapitaleth.js.map