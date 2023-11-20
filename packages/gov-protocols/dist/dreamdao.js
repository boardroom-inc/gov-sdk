"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDreamDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDreamDao = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'thedreamdaoeth';
    register({
        cname: cname,
        name: 'Dream DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'thedreamdao.eth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/thedreamdao_VozVzXYa_.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDreamDao = registerDreamDao;
//# sourceMappingURL=dreamdao.js.map