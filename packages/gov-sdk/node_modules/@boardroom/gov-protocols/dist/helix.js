"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHelix = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerHelix = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'helixgeometryeth',
        name: 'Helix',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'helixgeometry.eth',
                transports,
                cname: 'helixgeometryeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/helixgeometry_ZeY-XGqPN.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerHelix = registerHelix;
//# sourceMappingURL=helix.js.map