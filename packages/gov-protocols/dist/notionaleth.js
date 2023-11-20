"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registernotionaleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registernotionaleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'notionaleth',
        name: 'Notional Finance',
        category: ['Protocol', 'Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'notional.eth',
                transports,
                cname: 'notionaleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/notionaleth_gJvjNUGrM.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registernotionaleth = registernotionaleth;
//# sourceMappingURL=notionaleth.js.map