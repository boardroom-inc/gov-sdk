"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMorpho = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMorpho = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'morpho',
        name: 'Morpho',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'morpho.eth',
                transports,
                cname: 'morpho',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/morpho_Nbv0E3ur3.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMorpho = registerMorpho;
//# sourceMappingURL=morpho.js.map