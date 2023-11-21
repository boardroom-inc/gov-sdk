"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerMStable = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerMStable = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'mstable';
    register({
        cname: cname,
        name: 'mStable',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mstablegovernance.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('meta', transports);
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0x3dd46846eed8D147841AE162C8425c08BD8E1b41',
                '0xfcf455d6eb48b3289a712c0b3bc3c7ee0b0ee4c6',
                '0x67905d3e4fec0c85dce68195f66dc8eb32f59179',
            ], 1, transports);
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/mstable_xol_7ewN2l.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerMStable = registerMStable;
//# sourceMappingURL=mstable.js.map