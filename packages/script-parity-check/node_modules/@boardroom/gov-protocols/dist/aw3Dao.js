"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAw3Dao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAw3Dao = (register, transports, boardroomAPIKey) => {
    const cname = 'aw3dao';
    register({
        cname: cname,
        name: 'AW3 DAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xcc8a61b2164deb2c32494f36d42d6da6305169aa',
                tokenAddress: '0x85391721ab7c7bbe464af169b4093154d90660a4',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x496ce9f893c1664311ada8ca995a6e7809213089', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/aw3Dao_rbFULTKUX.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAw3Dao = registerAw3Dao;
//# sourceMappingURL=aw3Dao.js.map