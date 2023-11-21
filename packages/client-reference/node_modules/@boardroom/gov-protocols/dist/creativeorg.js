"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCreativeOrg = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCreativeOrg = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'creativeorg';
    register({
        cname: cname,
        name: 'Creative Org',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'thecreative.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xc48996a569911fd6eba1b97b6419731eed32041e', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/creativeorg_sxX_6VhYD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCreativeOrg = registerCreativeOrg;
//# sourceMappingURL=creativeorg.js.map