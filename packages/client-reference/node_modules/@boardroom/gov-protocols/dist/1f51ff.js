"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register1f51ff = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const register1f51ff = (register, transports, boardroomAPIKey) => {
    const cname = '1f51ff';
    register({
        cname: cname,
        name: '1F51FF',
        category: ['Media'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xbe3a2c56dbb3fea0311f67afdb34bb79180ed1ed',
                tokenAddress: '0x99586fe1c48a62b78ae871f3a4c7ebfd18b3bcdf',
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x4bb523c801bba44058482b6665ce4588603071cf', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-06/1f51ff_MkfMWthtX.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.register1f51ff = register1f51ff;
//# sourceMappingURL=1f51ff.js.map