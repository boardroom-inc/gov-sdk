"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergroxyz = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergroxyz = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'groxyz',
        name: 'Gro',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gro.xyz',
                transports,
                cname: 'groxyz',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/groxyz_RORX3aK70u.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergroxyz = registergroxyz;
//# sourceMappingURL=groxyz.js.map