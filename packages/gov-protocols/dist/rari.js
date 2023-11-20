"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRari = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerRari = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'rari';
    register({
        cname: cname,
        name: 'RariCapital',
        category: ['Investment'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'fuse.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('rari-governance-token', transports);
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x8ace03fc45139fddba944c6a4082b604041d19fc',
                '0x5eA4A9a7592683bF0Bc187d6Da706c6c4770976F',
                '0xBF2F341Ea21AaD9f1935636258E67F06C72353dd',
            ], 1, transports);
            const governor = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x91d9c2b5cF81D55a5f2Ecc0fC84E62f9cd2ceFd6',
                tokenAddress: '0xD291E7a03283640FDc51b121aC401383A46cC623',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const governorV2 = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x637deEED4e4deb1D222650bD4B64192abf002c00',
                tokenAddress: '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('createOnChainProposal', governorV2, 'onchain');
            adapters.implement('proposals', governorV2, 'onchain');
            adapters.implement('vote', governorV2, 'onchain');
            adapters.implement('votePower', governorV2, 'onchain');
            adapters.implement('delegation', governorV2, 'onchain');
            adapters.implement('general', governorV2, 'onchain');
            adapters.implement('proposals', governor, 'archive');
            adapters.implement('delegation', governor, 'archive');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/rarible_p-5xJNWzh.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerRari = registerRari;
//# sourceMappingURL=rari.js.map