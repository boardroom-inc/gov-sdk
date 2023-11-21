"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerShapeshift = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerShapeshift = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'shapeshift';
    register({
        cname: cname,
        name: 'ShapeShift',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'shapeshiftdao.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x90A48D5CF7343B08dA12E067680B4C6dbfE551Be', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('shapeshift-fox-token', transports);
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/shapeshift_x3YsAiM7J.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerShapeshift = registerShapeshift;
//# sourceMappingURL=shapeshift.js.map