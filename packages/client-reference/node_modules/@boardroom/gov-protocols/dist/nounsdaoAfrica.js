"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerNounsdaoAfrica = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerNounsdaoAfrica = (register, transports, boardroomAPIKey) => {
    const cname = 'nounsdaoAfrica';
    register({
        cname: cname,
        name: 'NounsDAO Africa',
        category: ['Social'],
        adapters: (adapters) => {
            const governance = new gov_adapters_1.NounsBuilderAdapter({
                governanceAddress: '0x86d4f8f1a332053b27cfa2f3d036f8c55112285a',
                tokenAddress: '0xd3e9387f3a1904d6803bcf9498d9a19e6f1a5f82',
                transports,
                protocolName: cname,
                boardroomAPIKey
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0xf48a170634cc456991b741b0f7abda5c41dd021e', 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/2023-03-15/nounsdaoAfrica_DQkcjuaq4.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerNounsdaoAfrica = registerNounsdaoAfrica;
//# sourceMappingURL=nounsdaoAfrica.js.map