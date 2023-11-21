"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerThisIsNotADao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerThisIsNotADao = (register, transports, boardroomAPIKey) => {
    const cname = 'thisIsNotADao';
    register({
        cname: cname,
        name: 'This Is Not A Dao',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xc35df7360d5783988481af9365405694ed3fc408',
                tokenAddress: '0x7a34eebfe37e39ae328f2330b8ea10e135a5bded',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x0f246d4fe97e97c8e3d93c39a34c8804f9f5b156', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/thisIsNotADao_hqwdReYMiL.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerThisIsNotADao = registerThisIsNotADao;
//# sourceMappingURL=thisIsNotADao.js.map