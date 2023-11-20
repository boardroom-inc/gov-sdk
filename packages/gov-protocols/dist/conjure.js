"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConjure = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerConjure = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'conjure';
    register({
        cname: cname,
        name: 'Conjure',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'conjure.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xa7b66b07ec0d63be7e4b544be15e0d3e591718dc', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/conjurefi_xUxQvl4pK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerConjure = registerConjure;
//# sourceMappingURL=conjure.js.map