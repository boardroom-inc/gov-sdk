"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBestforketh = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBestforketh = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'bestforketh',
        name: 'Wonderland ',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'bestfork.eth',
                transports,
                cname: 'bestforketh',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/bestforketh_2VUHrNYJK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBestforketh = registerBestforketh;
//# sourceMappingURL=bestforketh.js.map