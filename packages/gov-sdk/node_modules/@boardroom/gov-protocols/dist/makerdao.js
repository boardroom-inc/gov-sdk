"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMakerDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMakerDao = (register, transports, boardroomAPIKey) => {
    const cname = 'makerdao';
    register({
        cname: cname,
        name: 'Maker DAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('maker', transports);
            const executiveGovernor = new gov_adapters_1.MakerDaoGovernorExecutiveAdapter({
                chiefAddress: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
                tokenAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
                voteDelegateFactoryAddress: '0xd897f108670903d1d6070fcf818f9db3615af272',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const pollingGovernor = new gov_adapters_1.MakerDaoGovernorPollingAdapter({
                chiefAddress: '0x0a3f6849f78076aefaDf113F5BED87720274dDC0',
                pollingAddress: '0xD3A9FE267852281a1e6307a1C37CDfD76d39b133',
                tokenAddress: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
                voteProxyFactoryAddress: '0x6FCD258af181B3221073A96dD90D1f7AE7eEc408',
                voteDelegateFactoryAddress: '0xd897f108670903d1d6070fcf818f9db3615af272',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            adapters.implement('proposals', executiveGovernor, 'onchain');
            adapters.implement('vote', executiveGovernor, 'onchain');
            adapters.implement('votePower', executiveGovernor, 'onchain');
            adapters.implement('delegation', executiveGovernor, 'onchain');
            adapters.implement('proposals', pollingGovernor, 'onchain-secondary');
            adapters.implement('vote', pollingGovernor, 'onchain-secondary');
            adapters.implement('votePower', pollingGovernor, 'onchain-secondary');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/Mark_Maker_lN8u2ACB1.webp',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMakerDao = registerMakerDao;
//# sourceMappingURL=makerdao.js.map