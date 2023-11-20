"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registermetabrandseth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registermetabrandseth = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    register({
        cname: 'metabrandseth',
        name: 'MetaBrands',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'metabrands.eth',
                transports,
                cname: 'metabrandseth',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2022-12-23/metabrandseth_9N7bgRcIIH.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registermetabrandseth = registermetabrandseth;
//# sourceMappingURL=metabrandseth.js.map