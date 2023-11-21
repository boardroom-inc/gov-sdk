"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registergmdaoeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registergmdaoeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'gmdaoeth',
        name: 'gmdao',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gmdao.eth',
                transports,
                cname: 'gmdaoeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gmdao_logo_mRCnHoAPR.jpeg',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registergmdaoeth = registergmdaoeth;
//# sourceMappingURL=gmdaoeth.js.map