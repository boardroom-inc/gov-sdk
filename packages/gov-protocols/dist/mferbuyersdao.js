"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMferbuyersdao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMferbuyersdao = (register, transports, boardroomAPIKey) => {
    const cname = 'mferbuyersdao';
    register({
        cname: cname,
        name: 'MferBuyersDAO',
        category: ['Investment', 'Collector'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0xcd50ca9f9d15607bf86aa9c4df845a23a6045a90',
                tokenAddress: '0x37d0147042a49cd1f4a30a3ecb8e9557165f9bef',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xc812a86ad5822dc6773457748bcaccd076984b63', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/mferbuyersdao_Zx9sjXy2N.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMferbuyersdao = registerMferbuyersdao;
//# sourceMappingURL=mferbuyersdao.js.map