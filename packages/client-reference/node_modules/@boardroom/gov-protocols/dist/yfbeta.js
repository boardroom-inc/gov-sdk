"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYFBeta = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerYFBeta = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'yfbeta';
    register({
        cname: cname,
        name: 'yfBeta',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({ spaceName: 'yfbeta', transports, cname, snapshotApiKey, boardroomAPIKey });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('yfbeta', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
        },
    });
};
exports.registerYFBeta = registerYFBeta;
//# sourceMappingURL=yfbeta.js.map