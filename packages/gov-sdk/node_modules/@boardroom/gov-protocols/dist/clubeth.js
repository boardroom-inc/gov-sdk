"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerclubeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerclubeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'clubeth',
        name: 'Seed Club',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'club.eth',
                transports,
                cname: 'clubeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/clubeth_wgGHVfomt.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerclubeth = registerclubeth;
//# sourceMappingURL=clubeth.js.map