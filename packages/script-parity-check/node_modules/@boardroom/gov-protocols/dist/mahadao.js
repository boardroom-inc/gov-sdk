"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMahaDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMahaDAO = (register, transports, boardroomAPIKey, etherscanMainnetAPIKey) => {
    const cname = 'mahadao';
    register({
        cname: cname,
        name: 'MahaDAO',
        category: ['Protocol'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.OpenZeppelinGovernorAdapter({
                governanceAddress: '0x0fBd92eA11e23D959E1489A9Abb84ae2E4778D31',
                tokenAddress: '0x608917F8392634428Ec71C6766F3eC3f5cc8f421',
                transports,
                protocolName: cname,
                boardroomAPIKey,
                etherscanMainnetAPIKey
            });
            adapters.implement('createOnChainProposal', governor, 'onchain');
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('delegation', governor, 'onchain');
            adapters.implement('general', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/MahaDAO',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMahaDAO = registerMahaDAO;
//# sourceMappingURL=mahadao.js.map