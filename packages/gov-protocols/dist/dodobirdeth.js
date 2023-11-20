"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerdodobirdeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerdodobirdeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'dodobirdeth',
        name: 'DODO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dodobird.eth',
                transports,
                cname: 'dodobirdeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/dodobirdeth_dA3yI_w4aX.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerdodobirdeth = registerdodobirdeth;
//# sourceMappingURL=dodobirdeth.js.map