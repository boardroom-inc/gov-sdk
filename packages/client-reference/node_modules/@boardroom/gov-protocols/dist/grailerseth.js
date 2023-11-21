"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergrailerseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergrailerseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'grailerseth',
        name: 'GrailersDAO',
        category: ['Collector'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'grailers.eth',
                transports,
                cname: 'grailerseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/grailerseth_WwkTG7Uuc.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergrailerseth = registergrailerseth;
//# sourceMappingURL=grailerseth.js.map