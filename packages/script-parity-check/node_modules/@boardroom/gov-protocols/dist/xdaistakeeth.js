"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerxdaistakeeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerxdaistakeeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'xdaistakeeth',
        name: 'xDai Chain (Gnosis Chain)',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'xdaistake.eth',
                transports,
                cname: 'xdaistakeeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/xdaistakeeth_WpBEOwUs7p.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerxdaistakeeth = registerxdaistakeeth;
//# sourceMappingURL=xdaistakeeth.js.map