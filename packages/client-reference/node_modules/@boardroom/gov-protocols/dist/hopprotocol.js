"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHopProtocol = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerHopProtocol = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'hopprotocol';
    register({
        cname: cname,
        name: 'Hop Protocol',
        category: ['Protocol'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0xed8Bdb5895B8B7f9Fdb3C087628FD8410E853D48',
                tokenAddress: '0xc5102fE9359FD9a28f877a67E36B0F050d81a3CC',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xeeA8422a08258e73c139Fc32a25e10410c14bd7a', 1, transports);
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('hop-protocol', transports);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'hop.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/hopprotocol_w0D-41qIV.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerHopProtocol = registerHopProtocol;
//# sourceMappingURL=hopprotocol.js.map