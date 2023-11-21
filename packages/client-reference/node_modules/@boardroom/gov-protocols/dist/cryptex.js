"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCryptex = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCryptex = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'cryptex';
    register({
        cname: cname,
        name: 'Cryptex',
        category: ['Protocol'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0x874C5D592AfC6803c3DD60d6442357879F196d5b',
                tokenAddress: '0x321C2fE4446C7c963dc41Dd58879AF648838f98D',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('cryptex-finance', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xa54074b2cc0e96a43048d4a68472F7F046aC0DA8', 1, transports);
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cryptexdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/cryptexfi_PMGF48QV1Y.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCryptex = registerCryptex;
//# sourceMappingURL=cryptex.js.map