"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKeep2r = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKeep2r = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'keep2r';
    register({
        cname: cname,
        name: 'Keep2r',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'keep2r.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x49e7D50f6354357bB064305CE0BDC1695373B665', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/keep3r_1VAUfTsSC.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerKeep2r = registerKeep2r;
//# sourceMappingURL=keep2r.js.map