"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerdunjiaeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerdunjiaeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'dunjiaeth',
        name: 'ConstitutionDAO',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dunjia.eth',
                transports,
                cname: 'dunjiaeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/dunjiaeth_3OVr0ZCtn.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerdunjiaeth = registerdunjiaeth;
//# sourceMappingURL=dunjiaeth.js.map