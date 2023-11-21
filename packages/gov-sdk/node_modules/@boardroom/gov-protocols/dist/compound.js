"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCompound = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
class CompoundAlpha extends gov_adapters_1.CompoundGovernorAlphaAdapter {
    async getExternalLink() {
        return {
            name: 'Compound Governance',
            url: 'https://compound.finance/governance',
        };
    }
}
class CompoundBravo extends gov_adapters_1.CompoundGovernorBravoAdapter {
    async getExternalLink() {
        return {
            name: 'Compound Governance',
            url: 'https://compound.finance/governance',
        };
    }
}
const registerCompound = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'compound';
    register({
        cname: cname,
        name: 'Compound',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('compound-governance-token', transports);
            const alpha = new CompoundAlpha({
                governanceAddress: '0xc0dA01a04C3f3E0be433606045bB7017A7323E38',
                tokenAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const bravo = new CompoundBravo({
                governanceAddress: '0xc0Da02939E1441F497fd74F78cE7Decb17B66529',
                tokenAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            // Treasury addresses sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter(['0x3d9819210a31b4961b30ef54be2aed79b9c9cd3b', '0x2775b1c75658Be0F640272CCb8c72ac986009e38'], 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'comp-vote.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('createOnChainProposal', bravo, 'onchain');
            adapters.implement('proposals', bravo, 'onchain');
            adapters.implement('vote', bravo, 'onchain');
            adapters.implement('delegation', bravo, 'onchain');
            adapters.implement('votePower', bravo, 'onchain');
            adapters.implement('general', bravo, 'onchain');
            adapters.implement('proposals', alpha, 'archive');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/compound__QV8_w6Q8.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCompound = registerCompound;
//# sourceMappingURL=compound.js.map