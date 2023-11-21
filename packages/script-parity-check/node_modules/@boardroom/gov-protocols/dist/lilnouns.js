"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerLilNounsDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerLilNounsDAO = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'lilnouns';
    register({
        cname: cname,
        name: 'Lil Nouns DAO',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsGovernorAdapter({
                governanceAddress: '0x5d2C31ce16924C2a71D317e5BbFd5ce387854039',
                tokenAddress: '0x4b10701Bfd7BFEdc47d50562b76b436fbB5BdB3B',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xd5f279ff9EB21c6D40C8f345a66f2751C4eeA1fB', 1, transports);
            adapters.implement('proposals', governance, 'onchain');
            adapters.implement('vote', governance, 'onchain');
            adapters.implement('delegation', governance, 'onchain');
            adapters.implement('votePower', governance, 'onchain');
            adapters.implement('general', governance, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/lilnounsdao_iFsSs-B7h.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerLilNounsDAO = registerLilNounsDAO;
//# sourceMappingURL=lilnouns.js.map