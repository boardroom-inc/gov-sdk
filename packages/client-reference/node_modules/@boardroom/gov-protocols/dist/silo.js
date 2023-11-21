"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSilo = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerSilo = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'silo';
    register({
        cname: cname,
        name: 'Silo',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'silofinance.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('silo-finance', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xcFEedb0219A99bE73dFE04B2A9905a109Cf87823', 1, transports);
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0xA89163F7B2D68A8fbA6Ca36BEEd32Bd4f3EeAf61',
                tokenAddress: '0x6f80310CA7F2C654691D1383149Fa1A57d8AB1f8',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/silofinance_85eI8uVBV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerSilo = registerSilo;
//# sourceMappingURL=silo.js.map