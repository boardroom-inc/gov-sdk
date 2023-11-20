"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNameDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerNameDao = (register, transports, boardroomAPIKey) => {
    const cname = 'nameDao';
    register({
        cname: cname,
        name: 'Name DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x6c59a26104eb79ea8484b285358414709777b8cb',
                tokenAddress: '0xf4f971d9ebec10a3cd15ccbe7a500c34c0798ec5',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x652d1895b2b1ab7cceeed6f9c934b049d4be4193', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/nameDao_tXtSDYTFa9.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerNameDao = registerNameDao;
//# sourceMappingURL=nameDao.js.map