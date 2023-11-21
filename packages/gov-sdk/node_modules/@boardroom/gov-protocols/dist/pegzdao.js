"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPegzDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPegzDAO = (register, transports, boardroomAPIKey) => {
    const cname = 'pegzdao';
    register({
        cname: cname,
        name: 'PegzDAO',
        category: ['Grants'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.MolochGovernorAdapter({
                governanceAddress: '0x36fab4ac1d36e5f1015236261e42365cb4feac52',
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x36fab4ac1d36e5f1015236261e42365cb4feac52', 1, transports);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pegzdao_iSATkVlE5.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPegzDAO = registerPegzDAO;
//# sourceMappingURL=pegzdao.js.map