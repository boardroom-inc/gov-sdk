"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerYearn = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerYearn = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'ybaby';
    register({
        cname: cname,
        name: 'Yearn',
        category: ['Protocol'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'ybaby.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const snapshotArchive = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'yearn',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('yearn-finance', transports);
            // Treasury address sourced from https://github.com/dmihal/open-orgs.info/tree/master/data/adapters
            const treasury = new gov_adapters_1.CovalentAdapter([
                '0xfeb4acf3df3cdea7399794d0869ef76a6efaff52',
                '0x93A62dA5a14C80f265DAbC077fCEE437B1a0Efde',
                '0xd42e1Cb8b98382df7Db43e0F09dFE57365659D16',
            ], 1, transports);
            adapters.implement('proposals', snapshotArchive, 'archive');
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
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/yearn_CEniQ8rlg.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerYearn = registerYearn;
//# sourceMappingURL=yearn.js.map