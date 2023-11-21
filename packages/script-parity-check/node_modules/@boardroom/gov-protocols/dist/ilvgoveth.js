"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerilvgoveth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerilvgoveth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'ilvgoveth',
        name: 'Illuvinati Governance',
        category: ['Media', 'Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ilvgov.eth',
                transports,
                cname: 'ilvgoveth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/ilvgoveth_LnkMEDqX9n.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerilvgoveth = registerilvgoveth;
//# sourceMappingURL=ilvgoveth.js.map