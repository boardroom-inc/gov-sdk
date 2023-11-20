"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerThePanamaDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerThePanamaDao = (register, transports, boardroomAPIKey) => {
    const cname = 'thePanamaDao';
    register({
        cname: cname,
        name: 'The Panama DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x2c7b306ece936c606393450b1eda7fd59bd2667a',
                tokenAddress: '0xe403248c8f078fd6729309635cdd0a668ddd20f9',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xf1da938cbf912b9e5444f6532c20a58d09dd67b8', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/thePanamaDao_MczN1lsmWE.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerThePanamaDao = registerThePanamaDao;
//# sourceMappingURL=thePanamaDao.js.map