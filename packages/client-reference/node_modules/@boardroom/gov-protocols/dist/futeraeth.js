"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerfuteraeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerfuteraeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'futeraeth',
        name: 'Futera United',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'futera.eth',
                transports,
                cname: 'futeraeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/futeraeth_3D1w6sIh4e.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerfuteraeth = registerfuteraeth;
//# sourceMappingURL=futeraeth.js.map