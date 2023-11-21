"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerspecialresolutionnexusmutualeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerspecialresolutionnexusmutualeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'specialresolutionnexusmutualeth',
        name: 'Nexus Mutual Special Resolution',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'specialresolution.nexusmutual.eth',
                transports,
                cname: 'specialresolutionnexusmutualeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/specialresolutionnexusmutualeth_rq8hsXx2n5.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerspecialresolutionnexusmutualeth = registerspecialresolutionnexusmutualeth;
//# sourceMappingURL=specialresolutionnexusmutualeth.js.map