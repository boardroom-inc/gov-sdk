"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registertempusgoveth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registertempusgoveth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'tempusgoveth',
        name: 'Tempus',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tempusgov.eth',
                transports,
                cname: 'tempusgoveth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/tempusgoveth_z6fPf0rGmn.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registertempusgoveth = registertempusgoveth;
//# sourceMappingURL=tempusgoveth.js.map