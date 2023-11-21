"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerTestProtocol = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerTestProtocol = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'testProtocol';
    register({
        cname: cname,
        name: 'testProtocol',
        isEnabled: false,
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'mycontext.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Projects/BR_-_Main-Logomark__1__60Ayi_UZf.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerTestProtocol = registerTestProtocol;
//# sourceMappingURL=testProtocol.js.map