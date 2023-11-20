"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergnarseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergnarseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'gnarseth',
        name: 'Gnars',
        category: ['Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gnars.eth',
                transports,
                cname: 'gnarseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/gnarseth_RkmswjKHnS.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergnarseth = registergnarseth;
//# sourceMappingURL=gnarseth.js.map