"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerKrauseHouse = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerKrauseHouse = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'krausehouse';
    register({
        cname: cname,
        name: 'Krause House',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'krausehouse.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xE4762eAcEbDb7585D32079fdcbA5Bb94eb5d76F2', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/krausehouse_lFD9GwJY5.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerKrauseHouse = registerKrauseHouse;
//# sourceMappingURL=krausehouse.js.map