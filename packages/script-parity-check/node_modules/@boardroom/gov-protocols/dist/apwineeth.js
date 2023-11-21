"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerapwineeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerapwineeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'apwineeth',
        name: 'APWine',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'apwine.eth',
                transports,
                cname: 'apwineeth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/apwineeth_lXQWMi3ws.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerapwineeth = registerapwineeth;
//# sourceMappingURL=apwineeth.js.map