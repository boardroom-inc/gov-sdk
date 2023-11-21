"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerdecryptmediaeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerdecryptmediaeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'decryptmediaeth',
        name: 'Decrypt Media',
        category: ['Media'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'decrypt-media.eth',
                transports,
                cname: 'decryptmediaeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/decryptmediaeth_bb0D9jFoh.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerdecryptmediaeth = registerdecryptmediaeth;
//# sourceMappingURL=decryptmediaeth.js.map