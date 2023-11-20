"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTheParkDao = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTheParkDao = (register, transports, boardroomAPIKey) => {
    const cname = 'theParkDao';
    register({
        cname: cname,
        name: 'the park dao',
        category: ['Grants', 'Media'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x177702231005a46ce1e921900702cde96c9c9319',
                tokenAddress: '0x96e396e66087b2b9dcad36fd473e1b049df18998',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x673d37b930397c0defb51237e6fc42fed87b722f', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/theParkDao_Nc0aZBC4i.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTheParkDao = registerTheParkDao;
//# sourceMappingURL=theParkDao.js.map