"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDAOMasters = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDAOMasters = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'daomasters';
    register({
        cname: cname,
        name: 'daomasters',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'daomstr.eth',
                transports,
                cname,
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/daomasters_BSCP4yhZ0.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDAOMasters = registerDAOMasters;
//# sourceMappingURL=daomasters.js.map