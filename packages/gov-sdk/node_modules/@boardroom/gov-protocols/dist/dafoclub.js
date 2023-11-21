"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDAFOClub = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDAFOClub = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'dafoclub';
    register({
        cname: cname,
        name: 'DAFO Club',
        category: ['Investment'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.NounsGovernorAdapter({
                governanceAddress: '0x41FA7898cC5067Eb1ee73A2205eE30cC514D6C71',
                tokenAddress: '0xDad912c673F675e7cDA7eeA5931BeB189001dd8e',
                transports,
                protocolName: cname,
                alternateQuorumContract: true,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x1Fa6221FA6A70cD9BcA9d553A5f2E16Ba8706493', 1, transports);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dafo.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDAFOClub = registerDAFOClub;
//# sourceMappingURL=dafoclub.js.map