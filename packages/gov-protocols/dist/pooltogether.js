"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPoolTogether = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPoolTogether = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'pooltogether';
    register({
        cname: cname,
        name: 'PoolTogether',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('pooltogether', transports);
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0xB3a87172F555ae2a2AB79Be60B336D2F7D0187f0',
                tokenAddress: '0x0cEC1A9154Ff802e7934Fc916Ed7Ca50bDE6844e',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0x42cd8312d2bce04277dd5161832460e95b24262e', '0x21950e281bde1714ffd1062ed17c56d4d8de2359'], 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'pooltogether.eth',
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
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/pooltogether_eQ-8hDPSf.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerPoolTogether = registerPoolTogether;
//# sourceMappingURL=pooltogether.js.map