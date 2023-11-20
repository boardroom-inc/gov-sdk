"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRetoken = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRetoken = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'retoken';
    register({
        cname: cname,
        name: 'REtoken DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'retokendao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x2452A5721DE3e43169c456E464774B68a3942480', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/retokendao_Y65gXg327.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRetoken = registerRetoken;
//# sourceMappingURL=retoken.js.map