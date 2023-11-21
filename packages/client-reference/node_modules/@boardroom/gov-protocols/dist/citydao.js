"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCityDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCityDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'citydao';
    register({
        cname: cname,
        name: 'CityDAO',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'daocity.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x60e7343205C9C88788a22C40030d35f9370d302D', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/citydao_J4PK2r3Ve.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCityDAO = registerCityDAO;
//# sourceMappingURL=citydao.js.map