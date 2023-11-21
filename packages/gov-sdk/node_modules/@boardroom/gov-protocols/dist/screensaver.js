"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerScreensaver = void 0;
const gov_adapters_1 = require("@boardroom/gov-adapters");
const registerScreensaver = (register, transports, snapshotApiKey, boardroomAPIKey) => {
    const cname = 'screensaver';
    register({
        cname: cname,
        name: 'Screensaver',
        category: ['Product'],
        adapters: (adapters) => {
            const snapshot = new gov_adapters_1.SnapshotAdapter({
                spaceName: 'screensaver.eth',
                transports,
                cname,
                snapshotApiKey,
                boardroomAPIKey,
            });
            adapters.implement('createProposal', snapshot, 'snapshot');
            adapters.implement('proposals', snapshot, 'snapshot');
            adapters.implement('vote', snapshot, 'snapshot');
            adapters.implement('votePower', snapshot, 'snapshot');
            adapters.implement('icons', {
                async getIcons() {
                    return {
                        icons: [
                            {
                                size: 'normal',
                                url: 'https://ik.imagekit.io/4fqrcsooovf/Integrations/screensaver_s1JOIymsC.png',
                            },
                        ],
                    };
                },
            });
        },
    });
};
exports.registerScreensaver = registerScreensaver;
//# sourceMappingURL=screensaver.js.map