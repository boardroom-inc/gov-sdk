"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDoodles = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDoodles = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'doodles';
    register({
        cname: cname,
        name: 'Doodles',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'doodles.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            // Treasury address sourced from https://github.com/boardroom-inc/protocol-Info/pull/412
            const treasury = new gov_adapters_1.CovalentAdapter('0xDcd382bE6cC4f1971C667ffDa85C7a287605afe4', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/doodles_qu3wHQVSa.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDoodles = registerDoodles;
//# sourceMappingURL=doodles.js.map