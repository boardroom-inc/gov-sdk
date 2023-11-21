"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSudoswapDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSudoswapDao = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'sudoswapDao';
    register({
        cname: cname,
        name: 'sudoswap DAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x6853f8865BA8e9FBd9C8CCE3155ce5023fB7EEB0',
                tokenAddress: '0x3446Dd70B2D52A6Bf4a5a192D9b0A161295aB7F9',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/sudoswapDao_hv6XazrXK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSudoswapDao = registerSudoswapDao;
//# sourceMappingURL=sudoswapDao.js.map