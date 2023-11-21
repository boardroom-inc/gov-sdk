"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerbottoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerbottoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'bottoeth',
        name: 'Botto',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'botto.eth',
                transports,
                cname: 'bottoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/bottoeth_6-qzntBPgr.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerbottoeth = registerbottoeth;
//# sourceMappingURL=bottoeth.js.map