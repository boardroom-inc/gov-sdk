"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerArbitrum = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerArbitrum = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'arbitrum';
    register({
        cname: cname,
        name: 'Arbitrum',
        category: ['Protocol'],
        adapters: (adapters) => {
            const useTokenAddressForVotePower = true;
            const isTokenERC721 = false;
            const alternateDelegationAddress = '';
            const governorCore = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0xf07DeD9dC292157749B6Fd268E37DF6EA38395B9',
                tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
                transports,
                protocolName: cname,
                chainId: 42161,
                isTokenERC721,
                alternateDelegationAddress,
                useTokenAddressForVotePower,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const governorTreasury = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x789fC99093B09aD01C34DC7251D0C89ce743e5a4',
                tokenAddress: '0x912CE59144191C1204E64559FE8253a0e49E6548',
                transports,
                protocolName: cname,
                chainId: 42161,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'arbitrumfoundation.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createOnChainProposal', governorCore, 'onchain-arbitrum');
            adapters.implement('proposals', governorCore, 'onchain-arbitrum');
            adapters.implement('vote', governorCore, 'onchain-arbitrum');
            adapters.implement('delegation', governorCore, 'onchain-arbitrum');
            adapters.implement('votePower', governorCore, 'onchain-arbitrum');
            adapters.implement('general', governorCore, 'onchain-arbitrum');
            adapters.implement('createOnChainProposal', governorTreasury, 'onchain-secondary');
            adapters.implement('proposals', governorTreasury, 'onchain-secondary');
            adapters.implement('vote', governorTreasury, 'onchain-secondary');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('arbitrum', transports);
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/51cc280c-b992-4f5c-8190-d5aabd1f82c9_original_c_Czlz8oO.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerArbitrum = registerArbitrum;
//# sourceMappingURL=arbitrum.js.map