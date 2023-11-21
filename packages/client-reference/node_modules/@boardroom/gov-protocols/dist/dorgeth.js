"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerdorgeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerdorgeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'dorgeth',
        name: 'dOrg',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dorg.eth',
                transports,
                cname: 'dorgeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/dorgeth_Wn6w-hlLYc.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerdorgeth = registerdorgeth;
//# sourceMappingURL=dorgeth.js.map