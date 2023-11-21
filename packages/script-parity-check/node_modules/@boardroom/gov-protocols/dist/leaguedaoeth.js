"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerleaguedaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerleaguedaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'leaguedaoeth',
        name: 'LeagueDAO',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'leaguedao.eth',
                transports,
                cname: 'leaguedaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/leaguedaoeth_Rw2DIaZr4k.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerleaguedaoeth = registerleaguedaoeth;
//# sourceMappingURL=leaguedaoeth.js.map