"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerunipiloteth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerunipiloteth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'unipiloteth',
        name: 'Unipilot',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'unipilot.eth',
                transports,
                cname: 'unipiloteth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/unipiloteth_5flK_QBhNp.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerunipiloteth = registerunipiloteth;
//# sourceMappingURL=unipiloteth.js.map