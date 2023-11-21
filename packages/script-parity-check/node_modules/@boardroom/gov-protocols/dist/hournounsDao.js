"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHournounsDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerHournounsDao = (register, transports, boardroomAPIKey) => {
    const cname = 'hournounsDao';
    register({
        cname: cname,
        name: 'HourNouns DAO',
        category: ['Social', 'Grants'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xab5b0e6c04134e3d969b7cef05f667a0e2faa410',
                tokenAddress: '0x2c7f07b18c655afb2d12f469b96313bdebb5e2ba',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xc00ea5baa4b7e04c1d7e158e1951b40182fd8f37', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/hournounsDao_kuOfUiHCP.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerHournounsDao = registerHournounsDao;
//# sourceMappingURL=hournounsDao.js.map