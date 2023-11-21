"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerToad = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerToad = (register, transports, boardroomAPIKey) => {
    const cname = 'toad';
    register({
        cname: cname,
        name: 'TOAD',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x0d6e3d01877c5d6df304335def18561035594f17',
                tokenAddress: '0x194d46e0a1f18ceee4dc975c5d71a468bbae9071',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x2ea7daf221701df6ede5a1f6e744de7182d7d3f1', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/toad_L2diXNTEE.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerToad = registerToad;
//# sourceMappingURL=toad.js.map