"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerEmptySetDollar = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerEmptySetDollar = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'esd';
    register({
        cname: cname,
        name: 'EmptySetDollar',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'esd.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0x0599F087dF7900a1F806C5D149387Ee6e0a8BFCB',
                tokenAddress: '0x24aE124c4CC33D6791F8E8B63520ed7107ac8b3e',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
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
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/emptysetdollar_8v_XPyxjK.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerEmptySetDollar = registerEmptySetDollar;
//# sourceMappingURL=esd.js.map