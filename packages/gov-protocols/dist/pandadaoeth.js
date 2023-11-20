"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerpandadaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerpandadaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'pandadaoeth',
        name: 'PandaDAO',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'panda-dao.eth',
                transports,
                cname: 'pandadaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/pandadaoeth_AK55RYOkjx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerpandadaoeth = registerpandadaoeth;
//# sourceMappingURL=pandadaoeth.js.map