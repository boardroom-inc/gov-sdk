"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerswiveldaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerswiveldaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'swiveldaoeth',
        name: 'Swivel DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'swiveldao.eth',
                transports,
                cname: 'swiveldaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/swiveldaoeth_RAaWE_XBQa.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerswiveldaoeth = registerswiveldaoeth;
//# sourceMappingURL=swiveldaoeth.js.map