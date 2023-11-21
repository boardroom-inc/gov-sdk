"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerwagdieeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerwagdieeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'wagdieeth',
        name: 'WAGDIE',
        category: ['Social', 'Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'wagdie.eth',
                transports,
                cname: 'wagdieeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/wagdieeth_JASH5SL_P.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerwagdieeth = registerwagdieeth;
//# sourceMappingURL=wagdieeth.js.map