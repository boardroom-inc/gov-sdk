"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTornadoCash = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTornadoCash = (register, transports, boardroomAPIKey) => {
    const cname = 'tornadocash';
    register({
        cname: cname,
        name: 'Tornado Cash',
        category: ['Protocol'],
        adapters: (adapters) => {
            const coingecko = new gov_adapters_1.CoinGeckoAdapter('tornado-cash', transports);
            const treasury = new gov_adapters_1.CovalentAdapter(['0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce', '0x179f48C78f57A3A78f0608cC9197B8972921d1D2'], 1, transports);
            const governance = new gov_adapters_1.TornadoCashGovernorAdapter({
                governanceAddress: '0x5efda50f22d34F262c29268506C5Fa42cB56A1Ce',
                tokenAddress: '0x77777feddddffc19ff86db637967013e6c6a116c',
                transports,
                protocolName: cname,
                boardroomAPIKey: boardroomAPIKey
            });
            // Tornado currently uses snapshot for signaling only so until there is a way to
            // separate that out on the boardroom front end it won't be used.
            // const snapshot = new SnapshotAdapter('torn-community.eth', transports);
            // adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('proposals', governance, 'onchain');
            adapters.implement('vote', governance, 'onchain');
            adapters.implement('delegation', governance, 'onchain');
            adapters.implement('votePower', governance, 'onchain');
            adapters.implement('token', coingecko);
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/tornadocash_R98jMPlFu.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTornadoCash = registerTornadoCash;
//# sourceMappingURL=tornadocash.js.map