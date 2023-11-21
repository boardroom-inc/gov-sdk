"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEulerFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerEulerFi = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'eulerfi';
    register({
        cname: cname,
        name: 'Euler Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('euler', transports);
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0xd8E2114f6bCbaee83CDEB1bD6650a28BBcF144D5',
                tokenAddress: '0xd9Fcd98c322942075A5C3860693e9f4f03AAE07b',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0xd4Ee8939a537D943a4E46E7Ae04069C9451d724F'], 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'eulerdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/EulerFi_n-NoEgc95.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerEulerFi = registerEulerFi;
//# sourceMappingURL=eulerfi.js.map