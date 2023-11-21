"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerexpansiondaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerexpansiondaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'expansiondaoeth',
        name: 'ExpansionDAO',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'expansiondao.eth',
                transports,
                cname: 'expansiondaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/expansiondaoeth_oJqIeNbTzg.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerexpansiondaoeth = registerexpansiondaoeth;
//# sourceMappingURL=expansiondaoeth.js.map