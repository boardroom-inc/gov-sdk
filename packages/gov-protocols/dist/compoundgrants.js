"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompoundGrants = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCompoundGrants = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'compoundgrants';
    register({
        cname: cname,
        name: 'Compound Grants',
        category: ['Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'compoundgrants.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xF1D8c2eED95D5fC2EaDe4E6Bb15a5969453E89a9', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/compoundgrants_g1UeJZMkWe.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCompoundGrants = registerCompoundGrants;
//# sourceMappingURL=compoundgrants.js.map