"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerProjectOrigin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerProjectOrigin = (register, transports, boardroomAPIKey) => {
    const cname = 'projectorigin ';
    register({
        cname: cname,
        name: 'Project Origin ',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x25ae1870eb9631a774a2c75124843ff449f7b3a7',
                tokenAddress: '0xdebae9bb6fa49a7de4a4ffececa4a6ace20c88b2',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xee8b6ded1be453c852fc1ef5f2feadec4d6167a8', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-07-12/projectOrigin__Y0L-p8XJ5.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerProjectOrigin = registerProjectOrigin;
//# sourceMappingURL=projectOrigin%20.js.map