"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTraitworks = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTraitworks = (register, transports, boardroomAPIKey) => {
    const cname = 'traitworks';
    register({
        cname: cname,
        name: 'TraitWorks',
        category: ['Media', 'Collector', 'Grants'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xf50b4c7a58559b3e0cd3fc7fa2370604b23e2de8',
                tokenAddress: '0xe8f0b57a805b9a15fee874fdd8f6bc250a0d2c55',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xa0f1228dc23cbc44e6113bce4125636ef30ed211', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/traitworks_XkdwuWpSW.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTraitworks = registerTraitworks;
//# sourceMappingURL=traitworks.js.map