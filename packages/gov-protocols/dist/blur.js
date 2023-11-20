"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBlur = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBlur = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'blur';
    register({
        cname: cname,
        name: 'Blur',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0xF7967b43949Fb0Cec48e63e345512d5Ea5845810',
                tokenAddress: '0x5283D291DBCF85356A21bA090E6db59121208b44',
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/blur_pKTULLr9u.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBlur = registerBlur;
//# sourceMappingURL=blur.js.map