"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerDopewars = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerDopewars = (register, transports, snapshotApiKey, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'dopewars';
    register({
        cname: cname,
        name: 'Dopewars',
        category: ['Product'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('dope-wars-paper', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0xb57ab8767cae33be61ff15167134861865f7d22c', 1, transports);
            const governance = new gov_adapters_1.NounsGovernorAdapter({
                governanceAddress: '0xDBd38F7e739709fe5bFaE6cc8eF67C3820830E0C',
                tokenAddress: '0x8707276DF042E89669d69A177d3DA7dC78bd8723',
                transports,
                protocolName: cname,
                alternateQuorumContract: true,
                boardroomAPIKey,
                etherscanMainnetAPIKey,
            });
            adapters.implement('proposals', governance, 'onchain');
            adapters.implement('vote', governance, 'onchain');
            adapters.implement('delegation', governance, 'onchain');
            adapters.implement('votePower', governance, 'onchain');
            adapters.implement('general', governance, 'onchain');
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'dopedao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/dopewars_jsWVtDLKh.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerDopewars = registerDopewars;
//# sourceMappingURL=dopewars.js.map