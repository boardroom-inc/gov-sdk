"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMoonwell = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMoonwell = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'moonwell-governanceeth',
        name: 'Moonwell Governance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'moonwell-governance.eth',
                transports,
                cname: 'moonwell-governanceeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/moonwell-governance_k1-MD7Nae.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMoonwell = registerMoonwell;
//# sourceMappingURL=moonwell.js.map