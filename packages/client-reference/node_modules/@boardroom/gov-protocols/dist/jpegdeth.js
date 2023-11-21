"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerjpegdeth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerjpegdeth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'jpegdeth',
        name: 'JPEG’d',
        category: ['Protocol', 'Service'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'jpeg’d.eth',
                transports,
                cname: 'jpeg’deth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/jpeg_deth_iPNI7HAR-.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerjpegdeth = registerjpegdeth;
//# sourceMappingURL=jpegdeth.js.map