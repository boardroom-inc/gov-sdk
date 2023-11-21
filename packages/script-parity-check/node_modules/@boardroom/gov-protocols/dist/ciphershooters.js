"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCipherShooters = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCipherShooters = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'ciphershooterseth',
        name: 'CipherShooters DAO',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ciphershooters.eth',
                transports,
                cname: 'ciphershooterseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/ciphershooters_3ai1PH1Eq.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCipherShooters = registerCipherShooters;
//# sourceMappingURL=ciphershooters.js.map