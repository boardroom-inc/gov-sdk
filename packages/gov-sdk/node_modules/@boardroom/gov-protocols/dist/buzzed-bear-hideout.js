"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBuzzedBearHideout = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBuzzedBearHideout = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'buzzedbearhideout';
    register({
        cname: cname,
        name: 'Buzzed Bear Hideout',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'buzzedbears.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xcdd598d1588503e1609ae1e50cdb74473ffb0090', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/buzzedbearhideout_3f7t09FAQ.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBuzzedBearHideout = registerBuzzedBearHideout;
//# sourceMappingURL=buzzed-bear-hideout.js.map