"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHifiDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerHifiDao = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'hifidao';
    register({
        cname: cname,
        name: 'Hifi DAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0xef0A0421Ea43b602E5Be35e9018Dd3E34Bcee007',
                tokenAddress: '0x4b9278b94a1112cAD404048903b8d343a810B07e',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/hifiDao_cvfEOdWIl.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerHifiDao = registerHifiDao;
//# sourceMappingURL=hifiDao.js.map