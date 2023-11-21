"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPlasmaFinance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPlasmaFinance = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = '0xplasma';
    register({
        cname: cname,
        name: 'Plasma Finance',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: '0xplasma.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/0xplasma_7n16_RARo.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPlasmaFinance = registerPlasmaFinance;
//# sourceMappingURL=0xplasma.js.map