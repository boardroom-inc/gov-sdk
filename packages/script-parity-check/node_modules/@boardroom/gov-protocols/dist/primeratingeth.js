"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerprimeratingeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerprimeratingeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'primeratingeth',
        name: 'Prime Rating',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'primerating.eth',
                transports,
                cname: 'primeratingeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/primeratingeth_f5X_le7HW.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerprimeratingeth = registerprimeratingeth;
//# sourceMappingURL=primeratingeth.js.map