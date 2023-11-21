"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPublicNouns = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPublicNouns = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'publicNouns';
    register({
        cname: cname,
        name: 'Public Nouns',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x2BbEbFECA0fEbde8C70EF8501C991f3AB2095862',
                tokenAddress: '0x93ecac71499147627DFEc6d0E494d50fCFFf10EE',
                transports,
                protocolName: cname,
                isTokenERC721: true,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-04-17/publicNouns_ygwObHZ4R.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPublicNouns = registerPublicNouns;
//# sourceMappingURL=publicNouns.js.map