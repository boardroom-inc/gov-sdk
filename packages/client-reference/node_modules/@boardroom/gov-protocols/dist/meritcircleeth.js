"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermeritcircleeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermeritcircleeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'meritcircleeth',
        name: 'Merit Circle',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'meritcircle.eth',
                transports,
                cname: 'meritcircleeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/meritcircleeth_8JkwZZMIQ.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermeritcircleeth = registermeritcircleeth;
//# sourceMappingURL=meritcircleeth.js.map