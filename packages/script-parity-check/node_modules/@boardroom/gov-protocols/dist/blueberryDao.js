"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlueberryDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBlueberryDao = (register, transports, boardroomAPIKey) => {
    const cname = 'blueberryDao';
    register({
        cname: cname,
        name: 'Blueberry DAO',
        category: ['Grants'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x4f1f471124697eacde956c6130fb291cb1a22524',
                tokenAddress: '0xa54d5b96c3223fbcb8ebf312d9c4908e45ce8c50',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x27b0b5446c98322bf5cf133ca1e552353d5cca56', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/blueberryDao_u73_UNu4rw.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBlueberryDao = registerBlueberryDao;
//# sourceMappingURL=blueberryDao.js.map