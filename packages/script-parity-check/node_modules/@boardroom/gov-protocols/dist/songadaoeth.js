"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registersongadaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registersongadaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'songadaoeth',
        name: 'SongADAO',
        category: ['Media'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'songadao.eth',
                transports,
                cname: 'songadaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/songadaoeth_Q9-beEWzdp.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registersongadaoeth = registersongadaoeth;
//# sourceMappingURL=songadaoeth.js.map