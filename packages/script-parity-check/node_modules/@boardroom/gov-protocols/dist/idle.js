"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerIdle = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerIdle = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'idlefinance';
    register({
        cname: cname,
        name: 'Idle',
        category: ['Protocol'],
        adapters: (adapters) => {
            // https://idlefinance.medium.com/idle-governance-is-live-9b55e8f407d7
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0x2256b25CFC8E35c3135664FD03E77595042fe31B',
                tokenAddress: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const governorV2 = new gov_adapters_1.CompoundGovernorBravoAdapter({
                governanceAddress: '0x3D5Fc645320be0A085A32885F078F7121e5E5375',
                tokenAddress: '0x875773784Af8135eA0ef43b5a374AaD105c5D39e',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x107A369bc066c77FF061c7d2420618a6ce31B925',
                '0xb0aA1f98523Ec15932dd5fAAC5d86e57115571C7',
                '0x69a62C24F16d4914a48919613e8eE330641Bcb94',
                '0xBecC659Bfc6EDcA552fa1A67451cC6b38a0108E4',
                '0x076ff8E6402B02855ff82119B53E59bbDd67f0Ee',
                '0xFb3bD022D5DAcF95eE28a6B07825D4Ff9C5b3814',
                '0xD6dABBc2b275114a2366555d6C481EF08FDC2556',
            ], 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'idlefinance.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('idle', transports);
            adapters.implement('createOnChainProposal', governorV2, 'onchain');
            adapters.implement('proposals', governorV2, 'onchain');
            adapters.implement('vote', governorV2, 'onchain');
            adapters.implement('votePower', governorV2, 'onchain');
            adapters.implement('delegation', governorV2, 'onchain');
            adapters.implement('general', governor, 'onchain');
            // Idle Finance switched to CGBravo from CGAlpha, hence archiving CGAlpha proposals
            adapters.implement('proposals', governor, 'archive');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/idlefinancenew_PiElQl5ev.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerIdle = registerIdle;
//# sourceMappingURL=idle.js.map