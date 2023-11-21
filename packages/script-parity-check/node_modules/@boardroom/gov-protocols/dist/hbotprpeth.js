"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerhbotprpeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerhbotprpeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'hbotprpeth',
        name: 'Hummingbot Pull Requests',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'hbot-prp.eth',
                transports,
                cname: 'hbotprpeth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-09-06/hbotprpeth_08VMMchwcv.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerhbotprpeth = registerhbotprpeth;
//# sourceMappingURL=hbotprpeth.js.map