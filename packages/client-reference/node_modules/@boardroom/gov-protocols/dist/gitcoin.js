"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGitcoin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
/*

  closest thing to an official source I could find:

  https://discord.com/channels/562828676480237578/846742089392062545/846924385943814154

*/
const registerGitcoin = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'gitcoin';
    register({
        cname: cname,
        name: 'Gitcoin',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('gitcoin', transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gitcoindao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0xDbD27635A534A3d3169Ef0498beB56Fb9c937489',
                tokenAddress: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x57a8865cfB1eCEf7253c27da6B4BC3dAEE5Be518',
                '0xde21F729137C5Af1b01d73aF1dC21eFfa2B8a0d6',
                '0x44aa9c5a034c1499ec27906e2d427b704b567ffe',
            ], 1, transports);
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gitcoin_mcv6DBVP2.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGitcoin = registerGitcoin;
//# sourceMappingURL=gitcoin.js.map