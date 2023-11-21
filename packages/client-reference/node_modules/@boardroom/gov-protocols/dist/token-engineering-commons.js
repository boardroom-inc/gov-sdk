"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTokenEngineeringCommons = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTokenEngineeringCommons = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'token-engineering-commons';
    register({
        cname: cname,
        name: 'Token Engineering Commons',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tecommons.eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/tecommons_ZL3M7pIQm.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTokenEngineeringCommons = registerTokenEngineeringCommons;
//# sourceMappingURL=token-engineering-commons.js.map