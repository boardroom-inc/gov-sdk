"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerENS = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerENS = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'ens';
    register({
        cname: cname,
        name: 'Ethereum Name Service',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('ethereum-name-service', transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({ spaceName: 'ens.eth', transports, cname, snapshotApiKey, boardroomAPIKey });
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3',
                tokenAddress: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x283Af0B28c62C092C9727F1Ee09c02CA627EB7F5',
                '0xCF60916b6CB4753f58533808fA610FcbD4098Ec0',
                '0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7',
                '0xd7A029Db2585553978190dB5E85eC724Aa4dF23f',
            ], 1, transports);
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            const orcaPod = new gov_adapters_1.OrcaPodAdapter('0xFe89cc7aBB2C4183683ab71653C4cdc9B02D44b7', transports);
            adapters.implement('pod', orcaPod);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ens_agUHcg3Du.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerENS = registerENS;
//# sourceMappingURL=ens.js.map