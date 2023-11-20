"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDappGooseLabs = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDappGooseLabs = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'dappgooselabs';
    register({
        cname: cname,
        name: 'dappgooselabs',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dappgooselabs.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0xD979f8f203f9583e1fDA21B5Bf68DBd983A8E82A'], 1, transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dappgooselabspng_1V1t--YhH',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDappGooseLabs = registerDappGooseLabs;
//# sourceMappingURL=dappgooselabs.js.map