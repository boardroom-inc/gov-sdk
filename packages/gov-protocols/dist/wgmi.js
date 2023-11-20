"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerWGMI = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerWGMI = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'wgmi';
    register({
        cname: cname,
        name: 'WGMI',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'wgmicommunity.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/wgmi_tIQtTEsc4K.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerWGMI = registerWGMI;
//# sourceMappingURL=wgmi.js.map