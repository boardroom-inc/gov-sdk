"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMolochRises = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMolochRises = (register, transports, boardroomAPIKey) => {
    const cname = 'molochrises';
    register({
        cname: cname,
        name: 'Moloch Rises',
        category: ['Investment'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.MolochGovernorAdapter({
                governanceAddress: '0x519f9662798c2e07fbd5b30c1445602320c5cf5b',
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0x519f9662798c2e07fbd5b30c1445602320c5cf5b'], 1, transports);
            adapters.implement('treasury', treasury);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/moloch_toOSi3l_UM.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMolochRises = registerMolochRises;
//# sourceMappingURL=molochrises.js.map