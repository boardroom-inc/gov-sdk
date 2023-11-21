"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerCurveFi = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerCurveFi = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'curvefi';
    register({
        cname: cname,
        name: 'Curve Finance',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'curve.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('curve-dao-token', transports);
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/curvefi_Ukqe5FZuc.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerCurveFi = registerCurveFi;
//# sourceMappingURL=curvefi.js.map