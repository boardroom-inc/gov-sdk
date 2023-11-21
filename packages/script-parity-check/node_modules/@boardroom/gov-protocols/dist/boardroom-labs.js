"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBoardroomLabs = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBoardroomLabs = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'boardroomLabs';
    register({
        cname: cname,
        name: 'Boardroom Labs',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'boardroomlabs.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
        },
    });
};
exports.registerBoardroomLabs = registerBoardroomLabs;
//# sourceMappingURL=boardroom-labs.js.map