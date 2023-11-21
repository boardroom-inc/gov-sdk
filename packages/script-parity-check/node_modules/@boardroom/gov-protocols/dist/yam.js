"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYam = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerYam = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'yam';
    register({
        cname: cname,
        name: 'Yam',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'yam.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('yam-2', transports);
            const governor = new gov_adapters_1.CompoundGovernorAlphaAdapter({
                governanceAddress: '0x2DA253835967D6E721C6c077157F9c9742934aeA',
                tokenAddress: '0x0AaCfbeC6a24756c20D41914F2caba817C0d8521',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            // Treasury addresses sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x97990B693835da58A281636296D2Bf02787DEa17',
                '0xd67c05523d8ec1c60760fd017ef006b9f6e496d0',
                '0x205cc7463267861002b27021c7108bc230603d0f',
                '0xd67c05523d8ec1c60760fd017ef006b9f6e496d0',
            ], 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/yamfi_Rw8OpRr-U.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerYam = registerYam;
//# sourceMappingURL=yam.js.map