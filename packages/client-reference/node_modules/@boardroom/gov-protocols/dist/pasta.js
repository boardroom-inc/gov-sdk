"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPastaDAO = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerPastaDAO = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'pasta';
    register({
        cname: cname,
        name: 'PastaDAOv0',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'pasta.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('spaghetti', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
        },
    });
};
exports.registerPastaDAO = registerPastaDAO;
//# sourceMappingURL=pasta.js.map