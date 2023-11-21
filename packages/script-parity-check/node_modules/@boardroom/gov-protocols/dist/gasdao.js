"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGasDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGasDAO = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'gasdao';
    register({
        cname: cname,
        name: 'GasDAO',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('gas-dao', transports);
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x5B1751306597A76C8E6D2BFb8e952f8855Ed976d',
                tokenAddress: '0x6Bba316c48b49BD1eAc44573c5c871ff02958469',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'gasdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xC9A7D537F17194c68455D75e3d742BF2c3cE3c74', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gasdao_xkGVkSmnc.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGasDAO = registerGasDAO;
//# sourceMappingURL=gasdao.js.map