"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSeen = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSeen = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'seen';
    register({
        cname: cname,
        name: 'seen.haus',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'seenhaus.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/seenhaus_Yb8sJ74xu.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSeen = registerSeen;
//# sourceMappingURL=seen.js.map