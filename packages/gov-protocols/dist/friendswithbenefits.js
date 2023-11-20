"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerFriendsWithBenefits = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerFriendsWithBenefits = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'friendswithbenefits';
    register({
        cname: cname,
        name: 'Friends With Benefits',
        category: ['Social'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'friendswithbenefits.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('friends-with-benefits-pro', transports);
            const treasury = new gov_adapters_1.CovalentAdapter('0x660F6D6c9BCD08b86B50e8e53B537F2B40f243Bd', 1, transports);
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('delegation', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/friendswithbenefits_zPS3l-KGy.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerFriendsWithBenefits = registerFriendsWithBenefits;
//# sourceMappingURL=friendswithbenefits.js.map