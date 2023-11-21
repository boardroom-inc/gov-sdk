"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPaladin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPaladin = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'paladin';
    register({
        cname: cname,
        name: 'Paladin',
        category: ['Product'],
        adapters: (adapters) => {
            // No onchain governance at this time. Onchain only supports delegation through the token address
            // They also use a modified openzeppelin so if onchain voting starts we will have to update the adapter to support them
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '',
                tokenAddress: '0x624D822934e87D3534E435b83ff5C19769Efd9f6',
                transports,
                protocolName: cname,
                isTokenERC721: false,
                alternateDelegationAddress: undefined,
                useTokenAddressForVotePower: true,
                alternateVotePowerFunctionName: 'getCurrentVotes',
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'palvote.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('paladin', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/paladin_1Is4ZD0Zv.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPaladin = registerPaladin;
//# sourceMappingURL=paladin.js.map