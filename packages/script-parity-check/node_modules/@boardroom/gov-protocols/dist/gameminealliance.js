"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameMineAlliance = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerGameMineAlliance = (register, transports, boardroomAPIKey) => {
    const cname = 'gameminealliance';
    register({
        cname: cname,
        name: 'Game Mine Alliance',
        category: ['Investment'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.MolochGovernorAdapter({
                governanceAddress: '0x26edf55480c50a2fab52d0d7bdf1dbbf2f4bb14f',
                transports,
                protocolName: cname,
                boardroomAPIKey,
            });
            const treasury = new gov_adapters_1.CovalentAdapter('0x26edf55480c50a2fab52d0d7bdf1dbbf2f4bb14f', 1, transports);
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('treasury', treasury);
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/gameminealliance_yz0hFSZ1b.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerGameMineAlliance = registerGameMineAlliance;
//# sourceMappingURL=gameminealliance.js.map