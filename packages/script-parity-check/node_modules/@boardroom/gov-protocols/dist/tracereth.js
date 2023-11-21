"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registertracereth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registertracereth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'tracereth',
        name: 'Tracer',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'tracer.eth',
                transports,
                cname: 'tracereth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/tracereth_55FfcDweA.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registertracereth = registertracereth;
//# sourceMappingURL=tracereth.js.map