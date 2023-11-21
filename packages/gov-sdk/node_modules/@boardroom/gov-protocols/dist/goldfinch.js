"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGoldfinch = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGoldfinch = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'goldfincheth',
        name: 'Goldfinch',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'goldfinch.eth',
                transports,
                cname: 'goldfincheth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/goldfinch_zeEBszXPc.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGoldfinch = registerGoldfinch;
//# sourceMappingURL=goldfinch.js.map