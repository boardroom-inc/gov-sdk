"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registersynthetixstakerspolleth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registersynthetixstakerspolleth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'synthetixstakerspolleth',
        name: 'Synthetix Stakers Poll',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'synthetix-stakers-poll.eth',
                transports,
                cname: 'synthetixstakerspolleth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/synthetixstakerspolleth_vKetDCZbkK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registersynthetixstakerspolleth = registersynthetixstakerspolleth;
//# sourceMappingURL=synthetixstakerspolleth.js.map