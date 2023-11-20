"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerVPBasisDollar = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerVPBasisDollar = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'basisdollar';
    register({
        cname: cname,
        name: 'VPBasisDollar',
        category: ['Product'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'basisdollar.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('basis-dollar', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
        },
    });
};
exports.registerVPBasisDollar = registerVPBasisDollar;
//# sourceMappingURL=basisdollar.js.map