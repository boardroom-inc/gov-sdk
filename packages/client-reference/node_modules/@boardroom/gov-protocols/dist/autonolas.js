"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerAutonolas = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerAutonolas = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'autonolas';
    register({
        cname: cname,
        name: 'Autonolas',
        category: ['Protocol'],
        isEnabled: true,
        adapters: (adapters) => {
            const oldGovernor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x34C895f302D0b5cf52ec0Edd3945321EB0f83dd5',
                tokenAddress: '0x7e01A500805f8A52Fad229b3015AD130A332B7b3',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const currentGovernor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x8e84b5055492901988b831817e4ace5275a3b401',
                tokenAddress: '0x4039B809E0C0Ad04F6Fc880193366b251dDf4B40',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'autonolas.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x3C1fF68f5aa342D296d4DEe4Bb1cACCA912D95fE', 1, transports);
            //NEW GOVERNOR
            adapters.implement('createOnChainProposal', currentGovernor, 'onchain');
            adapters.implement('proposals', currentGovernor, 'onchain');
            adapters.implement('vote', currentGovernor, 'onchain');
            adapters.implement('votePower', currentGovernor, 'onchain');
            adapters.implement('delegation', currentGovernor, 'onchain');
            adapters.implement('general', currentGovernor, 'onchain');
            //OLD GOVERNOR
            adapters.implement('proposals', oldGovernor, 'archive');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/Autonolas_EVdaCq4qk.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerAutonolas = registerAutonolas;
//# sourceMappingURL=autonolas.js.map