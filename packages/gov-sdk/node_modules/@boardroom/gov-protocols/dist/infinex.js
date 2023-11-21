"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInfinex = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerInfinex = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'infinex';
    register({
        cname: cname,
        name: 'Infinex',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'infinex.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/infinex_SpiqXk5Qm.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerInfinex = registerInfinex;
//# sourceMappingURL=infinex.js.map