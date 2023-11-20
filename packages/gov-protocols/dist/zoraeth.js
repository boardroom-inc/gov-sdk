"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerzoraeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerzoraeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: "zoraeth",
        name: "Zora",
        category: ["Protocol"],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'zora.eth',
                transports,
                cname: 'zoraeth',
                chainId: 1,
                snapshotApiKey,
                boardroomAPIKey
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/zoraeth__hhMFRnbv.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerzoraeth = registerzoraeth;
//# sourceMappingURL=zoraeth.js.map