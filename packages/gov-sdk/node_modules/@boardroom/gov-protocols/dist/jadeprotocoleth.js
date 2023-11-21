"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerJadeprotocoleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerJadeprotocoleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'jadeprotocoleth',
        name: 'Jade Protocol DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'jadeprotocol.eth',
                transports,
                cname: 'jadeprotocoleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/jadeprotocoleth_uzU89IKVo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerJadeprotocoleth = registerJadeprotocoleth;
//# sourceMappingURL=jadeprotocoleth.js.map