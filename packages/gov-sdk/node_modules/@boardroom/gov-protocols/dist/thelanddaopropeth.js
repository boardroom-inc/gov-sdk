"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerthelanddaopropeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerthelanddaopropeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'thelanddaopropeth',
        name: 'TheLandSafe Proposals',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'thelanddaoprop.eth',
                transports,
                cname: 'thelanddaopropeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/thelanddaopropeth_EznkgFaRQ.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerthelanddaopropeth = registerthelanddaopropeth;
//# sourceMappingURL=thelanddaopropeth.js.map