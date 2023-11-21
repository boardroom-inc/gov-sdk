"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUberHaus = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
/**
 * This is a demo of a protocol that uses the xdai/gnosis network with moloch adapter.
 * It is not currently enabled in the front end.
 */
const registerUberHaus = (register, transports, boardroomAPIKey) => {
    const cname = 'uberhaus';
    register({
        cname: cname,
        name: 'UberHAUS',
        category: ['Uncategorized'],
        adapters: (adapters) => {
            const governor = new gov_adapters_1.MolochGovernorAdapter({
                governanceAddress: '0xeF3d8C4Fbb1860FcEaB16595DB7E650cd5AD51c1',
                transports,
                chainId: 100,
                protocolName: cname,
                boardroomAPIKey,
            });
            adapters.implement('proposals', governor, 'onchain');
            adapters.implement('vote', governor, 'onchain');
            adapters.implement('votePower', governor, 'onchain');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/uberhaus_Un-ZsqmeBn.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerUberHaus = registerUberHaus;
//# sourceMappingURL=uberhaus.js.map