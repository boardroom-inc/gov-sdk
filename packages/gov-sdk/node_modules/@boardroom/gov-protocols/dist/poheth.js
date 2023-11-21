"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerpoheth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerpoheth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'poheth',
        name: 'Proof Of Humanity',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'poh.eth',
                transports,
                cname: 'poheth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/poheth_jpCbCBXw8p.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerpoheth = registerpoheth;
//# sourceMappingURL=poheth.js.map