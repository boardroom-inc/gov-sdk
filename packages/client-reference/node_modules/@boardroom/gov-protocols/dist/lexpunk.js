"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLexPunk = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLexPunk = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'lexpunk';
    register({
        cname: cname,
        name: 'LexPunk',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'lexpunk.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x316dAa88D931C7221e2E4039F6B793ba2b724180', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lexpunk_wcJhQMT74.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLexPunk = registerLexPunk;
//# sourceMappingURL=lexpunk.js.map