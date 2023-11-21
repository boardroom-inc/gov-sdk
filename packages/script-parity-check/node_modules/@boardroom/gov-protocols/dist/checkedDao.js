"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCheckedDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCheckedDao = (register, transports, boardroomAPIKey) => {
    const cname = 'checkedDao';
    register({
        cname: cname,
        name: 'CHECKED DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x486190162d008bba496db4e7d28730472c405c10',
                tokenAddress: '0x9b27303eb9f7f1d817e2a03b246a76038f5d5402',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xc8e2b3b0edc3e88864601e1fb120556e9af5d3bb', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/checkedDao_q2Rxq1ZEi.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCheckedDao = registerCheckedDao;
//# sourceMappingURL=checkedDao.js.map