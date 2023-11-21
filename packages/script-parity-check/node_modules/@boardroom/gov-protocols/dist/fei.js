"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFei = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
/*

  https://github.com/fei-protocol/fei-protocol-core/blob/master/contracts/dao/GovernorAlpha.sol

*/
const registerFei = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'fei';
    register({
        cname: cname,
        name: 'Fei Money',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('tribe-2', transports);
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x0BEF27FEB58e857046d630B2c03dFb7bae567494',
                // Fei uses TRIBE token for gov
                tokenAddress: '0xc7283b66Eb1EB5FB86327f08e1B5816b0720212B',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x8d5ED43dCa8C2F7dFB20CF7b53CC7E593635d7b9', 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'fei.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/feiprotocol_Fgf3gCAA4.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerFei = registerFei;
//# sourceMappingURL=fei.js.map