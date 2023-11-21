"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLinksDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLinksDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'linksdao';
    register({
        cname: cname,
        name: 'LinksDAO',
        category: ['Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'golflinks.eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/linksdao_96eGyQlF9P.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLinksDAO = registerLinksDAO;
//# sourceMappingURL=linksdao.js.map