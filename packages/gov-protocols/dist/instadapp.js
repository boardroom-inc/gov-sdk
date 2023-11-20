"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerInstadapp = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
/*

  info:

  https://tokenpost.com/Instadapp-Core-Contracts-For-DSL-Are-Live-On-Ethereum-Blockchain-8015

*/
const registerInstadapp = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'instadapp';
    register({
        cname: cname,
        name: 'Instadapp',
        category: ['Protocol'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x0204Cd037B2ec03605CFdFe482D8e257C765fA1B',
                tokenAddress: '0x6f40d4A6237C257fff2dB00FA0510DeEECd303eb',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('instadapp', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x28849D2b63fA8D361e5fc15cB8aBB13019884d09', 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'instadapp-gov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/instadapp_aNNIzYeQp.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerInstadapp = registerInstadapp;
//# sourceMappingURL=instadapp.js.map