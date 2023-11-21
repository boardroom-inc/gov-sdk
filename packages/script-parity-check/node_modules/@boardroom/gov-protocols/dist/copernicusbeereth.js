"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registercopernicusbeereth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registercopernicusbeereth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'copernicusbeereth',
        name: 'Copernicus Beer',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'copernicusbeer.eth',
                transports,
                cname: 'copernicusbeereth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/copernicusbeereth_aw74OPPKJV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registercopernicusbeereth = registercopernicusbeereth;
//# sourceMappingURL=copernicusbeereth.js.map