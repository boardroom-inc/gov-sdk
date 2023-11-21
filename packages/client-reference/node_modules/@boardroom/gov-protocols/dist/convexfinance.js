"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerConvexFinance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerConvexFinance = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'convexfinance';
    register({
        cname: cname,
        name: 'Convex Finance',
        category: ['Protocol'],
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'cvx.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('convex-finance', transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/convexfi_VFU_Iew0tD.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerConvexFinance = registerConvexFinance;
//# sourceMappingURL=convexfinance.js.map