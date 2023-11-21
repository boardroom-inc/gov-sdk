"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAmpleforth = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAmpleforth = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'ampleforth';
    register({
        cname: cname,
        name: 'Ampleforth',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ampleforthorg.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x223592a191ECfC7FDC38a9256c3BD96E771539A9', 1, transports);
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('ampleforth-governance-token', transports);
            const governor = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x8a994C6F55Be1fD2B4d0dc3B8f8F7D4E3a2dA8F1',
                tokenAddress: '0x77FbA179C79De5B7653F68b5039Af940AdA60ce0',
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
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/ampleforth_vgg0qWFoU.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAmpleforth = registerAmpleforth;
//# sourceMappingURL=ampleforth.js.map