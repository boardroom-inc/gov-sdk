"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTrueFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTrueFi = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'truefigov';
    register({
        cname: cname,
        name: 'TrueFi',
        category: ['Protocol'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x585CcA060422ef1779Fb0Dd710A49e7C49A823C9',
                tokenAddress: '0x23696914Ca9737466D8553a2d619948f548Ee424',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'truefigov.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('truefi', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xE74B87233A43E73bdb002816a2290DC899eB73F3', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/truefi_t_sc3PSNp.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTrueFi = registerTrueFi;
//# sourceMappingURL=truefi.js.map