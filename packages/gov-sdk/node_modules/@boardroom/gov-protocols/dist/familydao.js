"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFamilydao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerFamilydao = (register, transports, boardroomAPIKey) => {
    const cname = 'familydao';
    register({
        cname: cname,
        name: 'FamilyDAO',
        category: ['Social', 'Grants'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x695e6ee88afb65de2a423379f90d1e337c500e3b',
                tokenAddress: '0x7acc85c844d86f7ade04e70647c88617c923ff0c',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x19d73267c13d69b42c0564b16572ff8032e2530b', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/familydao_xN0Nr2A3C.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerFamilydao = registerFamilydao;
//# sourceMappingURL=familydao.js.map