"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGrugslair = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGrugslair = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'grugslair';
    register({
        cname: cname,
        name: "Grug's Lair",
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'grugslair.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xB6Fc241c67C214D36fc4De65CA69F81b4302e7F4', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/grugslair_c3yyxm9_j.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGrugslair = registerGrugslair;
//# sourceMappingURL=grugslair.js.map