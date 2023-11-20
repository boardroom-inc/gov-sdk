"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAngle = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAngle = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'angle';
    register({
        cname: cname,
        name: 'Angle',
        category: ['Protocol'],
        isEnabled: true,
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x59153e939c5b4721543251ff3049Ea04c755373B',
                tokenAddress: '0x31429d1856aD1377A8A0079410B297e1a9e214c2',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('angle-protocol', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xdC4e6DFe07EFCa50a197DF15D9200883eF4Eb1c8', 1, transports);
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/angle_tgZUS73L7.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAngle = registerAngle;
//# sourceMappingURL=angle.js.map