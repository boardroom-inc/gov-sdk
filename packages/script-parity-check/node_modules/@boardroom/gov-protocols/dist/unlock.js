"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUnlockDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerUnlockDAO = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'unlock';
    register({
        cname: cname,
        name: 'Unlock Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('unlock-protocol', transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'unlock-protocol.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x17EEDFb0a6E6e06E95B3A1F928dc4024240BC76B', 1, transports);
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x7757f7f21F5Fa9b1fd168642B79416051cd0BB94',
                tokenAddress: '0x90DE74265a416e1393A450752175AED98fe11517',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/unlock_duHcWHSNV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerUnlockDAO = registerUnlockDAO;
//# sourceMappingURL=unlock.js.map