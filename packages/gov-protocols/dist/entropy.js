"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEntropy = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerEntropy = (register, transports, boardroomAPIKey) => {
    const cname = 'entropy';
    register({
        cname: cname,
        name: 'Entropy',
        category: ['Media', 'Service'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x444b949eb2eac0fad755160aa0ec4f98f68666c6',
                tokenAddress: '0x8983ec4b57dbebe8944af8d4f9d3adbafea5b9f1',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x120840f12f1bc1c19c9b347929e948b154e46496', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/entropy_og8A7A7eB.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerEntropy = registerEntropy;
//# sourceMappingURL=entropy.js.map