"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMclub = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMclub = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'mclub';
    register({
        cname: cname,
        name: 'mclub',
        category: ['Grants'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'm.club.eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/mclubdao_YzsbkofvT.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMclub = registerMclub;
//# sourceMappingURL=mclub.js.map