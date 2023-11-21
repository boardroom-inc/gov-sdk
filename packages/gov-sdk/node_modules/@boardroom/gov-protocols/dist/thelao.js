"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheLAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTheLAO = (register, transports, boardroomAPIKey) => {
    const cname = 'thelao';
    register({
        cname: cname,
        name: 'The LAO',
        category: ['Investment'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.MolochGovernorAdapter({
                governanceAddress: '0x8f56682a50becb1df2fb8136954f2062871bc7fc',
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0x8f56682a50becb1df2fb8136954f2062871bc7fc'], 1, transports);
            adapters.implement('treasury', treasury);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/thelao_wov84mOUL.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTheLAO = registerTheLAO;
//# sourceMappingURL=thelao.js.map