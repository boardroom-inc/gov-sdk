"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheGivingNouns = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTheGivingNouns = (register, transports, boardroomAPIKey) => {
    const cname = 'theGivingNouns';
    register({
        cname: cname,
        name: 'The Giving Nouns',
        category: ['Social', 'Grants'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x565e24400226a982cfa6676bf4b3e2b100efb1c3',
                tokenAddress: '0x25fcdb1c8e479ed4318351351e45c16345072ad6',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xfd9122c469d6c01993cda3f976cb67f57304cdd2', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/theGivingNouns_oNHjhFfWi.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTheGivingNouns = registerTheGivingNouns;
//# sourceMappingURL=theGivingNouns.js.map