"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTribeNopedao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTribeNopedao = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'tribeNopedao';
    register({
        cname: cname,
        name: 'Tribe NopeDAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x6C7aF43Ce97686e0C8AcbBc03b2E4f313c0394C7',
                tokenAddress: '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/tribeNopedao_ZgyLSbNLx.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTribeNopedao = registerTribeNopedao;
//# sourceMappingURL=tribeNopedao.js.map