"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerwearebeansprouteth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerwearebeansprouteth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'wearebeansprouteth',
        name: 'Bean Sprout',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'wearebeansprout.eth',
                transports,
                cname: 'wearebeansprouteth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/wearebeansprouteth_RcQNGmoGqt.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerwearebeansprouteth = registerwearebeansprouteth;
//# sourceMappingURL=wearebeansprouteth.js.map