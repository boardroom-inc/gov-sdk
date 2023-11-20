"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerredactedcarteleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerredactedcarteleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'redactedcarteleth',
        name: 'Redacted',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'redactedcartel.eth',
                transports,
                cname: 'redactedcarteleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/redactedcarteleth_Yh1izTlgE.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerredactedcarteleth = registerredactedcarteleth;
//# sourceMappingURL=redactedcarteleth.js.map