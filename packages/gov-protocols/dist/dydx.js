"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDydx = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
class DydxAdapter extends gov_adapters_1.AaveGovernanceV2Adapter {
    async getExternalLink() {
        return {
            name: 'Dydx Governance',
            url: 'https://dydx.community/dashboard',
        };
    }
}
const registerDydx = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'dydx';
    register({
        cname: cname,
        name: 'dYdX',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('dydx', transports);
            const governor = new DydxAdapter({
                contracts: {
                    governance: '0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2',
                    token: '0x92D6C1e31e14520e676a687F0a93788B716BEff5',
                    strategy: '0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9',
                },
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter(['0xE710CEd57456D3A16152c32835B5FB4E72D9eA5b', '0x08a90Fe0741B7DeF03fB290cc7B273F1855767D8'], 1, transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dydxgov.eth',
                transports,
                cname: 'dydxgoveth',
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            const stakedGovernor = new DydxAdapter({
                contracts: {
                    governance: '0x7E9B1672616FF6D6629Ef2879419aaE79A9018D2',
                    token: '0x65f7ba4ec257af7c55fd5854e5f6356bbd0fb8ec',
                    strategy: '0x90Dfd35F4a0BB2d30CDf66508085e33C353475D9',
                },
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            adapters.implement('votePower', stakedGovernor, 'onchain-secondary');
            adapters.implement('delegation', stakedGovernor, 'onchain-secondary');
            adapters.implement('general', stakedGovernor, 'onchain-secondary');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dydx_6IZ4WZpau.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDydx = registerDydx;
//# sourceMappingURL=dydx.js.map