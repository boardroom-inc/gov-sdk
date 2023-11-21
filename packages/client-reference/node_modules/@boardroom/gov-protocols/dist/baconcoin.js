"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerBaconCoin = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerBaconCoin = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'baconcoin';
    register({
        cname: cname,
        name: 'Bacon Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'baconcoin.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x5089722613C2cCEe071C39C59e9889641f435F15', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0xaBB55d166Bb028d0d73c9aA31e294c88cFE29579',
                tokenAddress: '0xa54d2EBfD977ad836203c85F18db2F0a0cF88854',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/baconprotocol_mPRDuR1bF.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerBaconCoin = registerBaconCoin;
//# sourceMappingURL=baconcoin.js.map