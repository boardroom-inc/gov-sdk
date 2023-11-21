"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAave = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
class AaveAdapter extends gov_adapters_1.AaveGovernanceV2Adapter {
    async getExternalLink() {
        return {
            name: 'Aave Governance',
            url: 'https://app.aave.com/governance',
        };
    }
}
const registerAave = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'aave';
    register({
        cname: cname,
        name: 'Aave',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('aave', transports);
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'aave.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const governance = new AaveAdapter({
                contracts: {
                    governance: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
                    token: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
                    strategy: '0xb7e383ef9B1E9189Fc0F71fb30af8aa14377429e',
                },
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter('0x25f2226b597e8f9514b3f68f00f494cf4f286491', 1, transports);
            adapters.implement('proposals', governance, 'onchain');
            adapters.implement('vote', governance, 'onchain');
            adapters.implement('votePower', governance, 'onchain');
            adapters.implement('delegation', governance, 'onchain');
            adapters.implement('general', governance, 'onchain');
            const stakedGovernance = new AaveAdapter({
                contracts: {
                    governance: '0xEC568fffba86c094cf06b22134B23074DFE2252c',
                    token: '0x4da27a545c0c5b758a6ba100e3a049001de870f5',
                    strategy: '0xb7e383ef9B1E9189Fc0F71fb30af8aa14377429e',
                },
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            adapters.implement('votePower', stakedGovernance, 'onchain-secondary');
            adapters.implement('delegation', stakedGovernance, 'onchain-secondary');
            adapters.implement('general', stakedGovernance, 'onchain-secondary');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/aave_8bqAXQ4KCi.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAave = registerAave;
//# sourceMappingURL=aave.js.map