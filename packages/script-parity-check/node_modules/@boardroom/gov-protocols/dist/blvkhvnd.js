"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlvkhvnd = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBlvkhvnd = (register, transports, boardroomAPIKey) => {
    const cname = 'blvkhvnd';
    register({
        cname: cname,
        name: 'BLVKHVND',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xa54ce3c884c68c01596853b25a3208acefda540e',
                tokenAddress: '0x351ea1a718521f22718ae14f7d380ae345fad043',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x3bdc8d32934b4736598c4206d0a56911bf833e8c', 1, transports);
            adapters.implement('proposals', governance, 'onchain');
            adapters.implement('vote', governance, 'onchain');
            adapters.implement('delegation', governance, 'onchain');
            adapters.implement('votePower', governance, 'onchain');
            adapters.implement('general', governance, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/blvkhvnd_dL3uG3BK1.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBlvkhvnd = registerBlvkhvnd;
//# sourceMappingURL=blvkhvnd.js.map