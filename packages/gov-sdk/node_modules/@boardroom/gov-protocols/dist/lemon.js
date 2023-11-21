"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLemon = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLemon = (register, transports, boardroomAPIKey) => {
    const cname = 'lemon';
    register({
        cname: cname,
        name: 'Lemon',
        category: ['Protocol', 'Product'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xb33e426b0435a0e748e33837377f61c20f07b009',
                tokenAddress: '0x85744291ce834ccf7532c280a3b13bdfb65cfe33',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x670730b91468a842cd3b623c90a6f9597c7813fb', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/lemon_jo5uwacP1.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLemon = registerLemon;
//# sourceMappingURL=lemon.js.map