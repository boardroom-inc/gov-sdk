"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerundw3eth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerundw3eth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'undw3eth',
        name: 'Lacoste UNDW3',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'undw3.eth',
                transports,
                cname: 'undw3eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/undw3eth_z_NseRHWQa.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerundw3eth = registerundw3eth;
//# sourceMappingURL=undw3eth.js.map